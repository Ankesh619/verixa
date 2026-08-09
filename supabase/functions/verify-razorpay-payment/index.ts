import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Only POST requests are allowed.",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    /*
     * Environment variables
     */
    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const razorpayKeyId =
      Deno.env.get("RAZORPAY_KEY_ID");

    const razorpayKeySecret =
      Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Supabase environment variables are missing."
      );
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error(
        "Razorpay credentials are missing."
      );
    }

    /*
     * Supabase admin client
     */
    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    /*
     * Read request body
     */
    const body = await req.json();

    const razorpayPaymentId =
      body?.razorpay_payment_id;

    const razorpayOrderId =
      body?.razorpay_order_id;

    const razorpaySignature =
      body?.razorpay_signature;

    const applicationId =
      body?.applicationId;

    if (
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Razorpay payment verification data is incomplete.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    if (!applicationId) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Application ID is required.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    /*
     * Find payment record using
     * Razorpay Order ID
     */
    const {
      data: payment,
      error: paymentFindError,
    } = await supabase
      .from("payments")
      .select("*")
      .eq(
        "transactionId",
        razorpayOrderId
      )
      .eq(
        "applicationId",
        applicationId
      )
      .maybeSingle();

    if (paymentFindError) {
      console.error(
        "Payment Lookup Error:",
        paymentFindError
      );

      throw new Error(
        "Unable to find payment record."
      );
    }

    if (!payment) {
      throw new Error(
        "Payment record not found for this Razorpay order."
      );
    }

    /*
     * Verify Razorpay signature
     *
     * Signature payload:
     * order_id|payment_id
     */
    const signaturePayload =
      `${razorpayOrderId}|${razorpayPaymentId}`;

    const encoder =
      new TextEncoder();

    const keyData =
      encoder.encode(
        razorpayKeySecret
      );

    const messageData =
      encoder.encode(
        signaturePayload
      );

    const cryptoKey =
      await crypto.subtle.importKey(
        "raw",
        keyData,
        {
          name: "HMAC",
          hash: "SHA-256",
        },
        false,
        ["sign"]
      );

    const signatureBuffer =
      await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        messageData
      );

    const signatureBytes =
      new Uint8Array(
        signatureBuffer
      );

    const generatedSignature =
      Array.from(
        signatureBytes
      )
        .map((byte) =>
          byte
            .toString(16)
            .padStart(2, "0")
        )
        .join("");

    /*
     * Compare signatures
     */
    if (
      generatedSignature !==
      razorpaySignature
    ) {
      console.error(
        "Invalid Razorpay Signature"
      );

      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Payment verification failed. Invalid Razorpay signature.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    /*
     * Signature is valid.
     *
     * Update payment as successful.
     */
    const {
      data: updatedPayment,
      error: updateError,
    } = await supabase
      .from("payments")
      .update({
        transactionId:
          razorpayPaymentId,

        status:
          "Success",

        paidAt:
          new Date().toISOString(),
      })
      .eq(
        "id",
        payment.id
      )
      .select()
      .single();

    if (updateError) {
      console.error(
        "Payment Update Error:",
        updateError
      );

      throw new Error(
        "Payment was verified but payment record could not be updated."
      );
    }

    /*
     * Return success
     */
    return new Response(
      JSON.stringify({
        success: true,

        message:
          "Payment verified successfully.",

        paymentId:
          razorpayPaymentId,

        orderId:
          razorpayOrderId,

        applicationId:
          applicationId,

        payment:
          updatedPayment,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Verify Razorpay Payment Error:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});