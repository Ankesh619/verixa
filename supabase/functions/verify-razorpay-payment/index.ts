import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type VerifyRequest = {
  applicationId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

const jsonResponse = (
  body: Record<string, unknown>,
  status = 200
) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

async function generateHmacSha256(
  secret: string,
  message: string
): Promise<string> {
  const encoder = new TextEncoder();

  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    messageData
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeCompare(
  a: string,
  b: string
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        success: false,
        error: "Only POST requests are allowed.",
      },
      405
    );
  }

  try {
    const body =
      (await req.json()) as Partial<VerifyRequest>;

    const applicationId =
      body.applicationId?.trim();

    const razorpayOrderId =
      body.razorpayOrderId?.trim();

    const razorpayPaymentId =
      body.razorpayPaymentId?.trim();

    const razorpaySignature =
      body.razorpaySignature?.trim();

    if (
      !applicationId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return jsonResponse(
        {
          success: false,
          error:
            "Missing payment verification information.",
        },
        400
      );
    }

    const razorpaySecret =
      Deno.env.get("RAZORPAY_KEY_SECRET");

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!razorpaySecret) {
      console.error(
        "RAZORPAY_KEY_SECRET is missing."
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Razorpay secret is not configured on the server.",
        },
        500
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Supabase server credentials are missing."
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Supabase server configuration is incomplete.",
        },
        500
      );
    }

    /*
     * Razorpay signature verification
     *
     * Signature is generated from:
     *
     * razorpayOrderId + "|" + razorpayPaymentId
     */

    const signatureMessage =
      razorpayOrderId +
      "|" +
      razorpayPaymentId;

    const generatedSignature =
      await generateHmacSha256(
        razorpaySecret,
        signatureMessage
      );

    if (
      !safeCompare(
        generatedSignature,
        razorpaySignature
      )
    ) {
      console.error(
        "Invalid Razorpay signature."
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Payment verification failed. Invalid signature.",
        },
        400
      );
    }

    /*
     * Create privileged Supabase client.
     *
     * Service-role key is NEVER exposed
     * to the frontend.
     */

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

    /*
     * Load application
     */

    const {
      data: application,
      error: applicationError,
    } =
      await supabaseAdmin
        .from("applications")
        .select(
          "id, customerName, mobile, serviceName, price, status"
        )
        .eq("id", applicationId)
        .single();

    if (applicationError) {
      console.error(
        "Application Load Error:",
        applicationError
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Unable to find the application.",
        },
        404
      );
    }

    if (!application) {
      return jsonResponse(
        {
          success: false,
          error:
            "Application not found.",
        },
        404
      );
    }

    const amount = Number(
      application.price || 0
    );

    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse(
        {
          success: false,
          error:
            "Invalid application payment amount.",
        },
        400
      );
    }

    /*
     * Prevent duplicate successful payments.
     */

    const {
      data: existingPayments,
      error: existingPaymentError,
    } =
      await supabaseAdmin
        .from("payments")
        .select(
          "id, applicationId, transactionId, status"
        )
        .eq(
          "applicationId",
          applicationId
        )
        .order("createdAt", {
          ascending: false,
        });

    if (existingPaymentError) {
      console.error(
        "Existing Payment Check Error:",
        existingPaymentError
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Unable to check existing payments.",
        },
        500
      );
    }

    const alreadyPaid =
      (existingPayments || []).some(
        (payment) => {
          const status =
            payment.status?.toLowerCase();

          return (
            status === "success" ||
            status === "completed"
          );
        }
      );

    if (alreadyPaid) {
      return jsonResponse({
        success: true,
        verified: true,
        alreadyPaid: true,
        message:
          "This application has already been paid successfully.",
      });
    }

    /*
     * Save successful payment.
     */

    const now =
      new Date().toISOString();

    const {
      data: payment,
      error: paymentInsertError,
    } =
      await supabaseAdmin
        .from("payments")
        .insert({
          applicationId:
            application.id,

          customerName:
            application.customerName,

          mobile:
            application.mobile,

          serviceName:
            application.serviceName,

          amount,

          paymentMethod:
            "Razorpay",

          transactionId:
            razorpayPaymentId,

          status:
            "Success",

          paidAt: now,

          createdAt: now,
        })
        .select()
        .single();

    if (paymentInsertError) {
      console.error(
        "Payment Insert Error:",
        paymentInsertError
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Payment was verified, but payment record could not be saved.",
        },
        500
      );
    }

    /*
     * Update application timestamp.
     *
     * Payment status itself is stored in
     * the payments table.
     */

    const {
      error: applicationUpdateError,
    } =
      await supabaseAdmin
        .from("applications")
        .update({
          updatedAt: now,
        })
        .eq(
          "id",
          applicationId
        );

    if (applicationUpdateError) {
      console.error(
        "Application Update Error:",
        applicationUpdateError
      );
    }

    return jsonResponse({
      success: true,
      verified: true,
      alreadyPaid: false,

      payment: {
        id:
          payment?.id || null,

        applicationId:
          application.id,

        amount,

        paymentMethod:
          "Razorpay",

        transactionId:
          razorpayPaymentId,

        status:
          "Success",

        paidAt:
          payment?.paidAt || now,
      },
    });
  } catch (error) {
    console.error(
      "Verify Razorpay Payment Error:",
      error
    );

    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed.",
      },
      500
    );
  }
});