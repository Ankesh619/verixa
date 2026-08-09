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
          error: "Only POST requests are allowed",
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

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      throw new Error(
        "Supabase environment variables are missing."
      );
    }

    if (
      !razorpayKeyId ||
      !razorpayKeySecret
    ) {
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

    const applicationId =
      body?.applicationId;

    if (!applicationId) {
      return new Response(
        JSON.stringify({
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
     * Load application
     */
    const {
      data: application,
      error: applicationError,
    } = await supabase
      .from("applications")
      .select(
        "id, customerName, mobile, serviceName, price, status"
      )
      .eq("id", applicationId)
      .single();

    if (applicationError) {
      console.error(
        "Application Error:",
        applicationError
      );

      throw new Error(
        "Unable to load application."
      );
    }

    if (!application) {
      throw new Error(
        "Application not found."
      );
    }

    /*
     * Amount in rupees
     */
    const amountRupees = Number(
      application.price || 0
    );

    if (
      !Number.isFinite(amountRupees) ||
      amountRupees <= 0
    ) {
      throw new Error(
        "Invalid application amount."
      );
    }

    /*
     * Razorpay uses paise.
     *
     * Example:
     * ₹100 = 10000 paise
     */
    const amountPaise =
      Math.round(amountRupees * 100);

    /*
     * Razorpay order receipt
     */
    const receipt =
      `VX-${application.id.substring(
        0,
        12
      )}`;

    /*
     * Razorpay Basic Authentication
     */
    const credentials =
      `${razorpayKeyId}:${razorpayKeySecret}`;

    const encodedCredentials =
      btoa(credentials);

    /*
     * Create Razorpay Order
     */
    const razorpayResponse =
      await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Basic ${encodedCredentials}`,
          },

          body: JSON.stringify({
            amount: amountPaise,
            currency: "INR",
            receipt,

            notes: {
              applicationId:
                application.id,

              customerName:
                application.customerName ||
                "",

              mobile:
                application.mobile ||
                "",

              serviceName:
                application.serviceName ||
                "",
            },
          }),
        }
      );

    const razorpayData =
      await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error(
        "Razorpay Order Error:",
        razorpayData
      );

      throw new Error(
        razorpayData?.error?.description ||
          "Unable to create Razorpay order."
      );
    }

    /*
     * Save pending payment record
     */
    const {
      data: payment,
      error: paymentError,
    } = await supabase
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

        amount:
          amountRupees,

        paymentMethod:
          "Razorpay",

        transactionId:
          razorpayData.id,

        status:
          "Pending",

        paidAt:
          null,

        createdAt:
          new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      console.error(
        "Payment Insert Error:",
        paymentError
      );

      throw new Error(
        "Razorpay order created but payment record could not be saved."
      );
    }

    /*
     * Return only safe data to frontend.
     *
     * IMPORTANT:
     * razorpayKeySecret is NEVER returned.
     */
    return new Response(
      JSON.stringify({
        success: true,

        orderId:
          razorpayData.id,

        amount:
          razorpayData.amount,

        currency:
          razorpayData.currency,

        keyId:
          razorpayKeyId,

        paymentId:
          payment?.id || null,

        applicationId:
          application.id,
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
      "Create Razorpay Order Error:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
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