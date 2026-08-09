import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  IndianRupee,
  ArrowLeft,
  Receipt,
} from "lucide-react";

import { supabase } from "../supabase";

type Application = {
  id: string;
  customerName: string | null;
  mobile: string | null;
  serviceName: string | null;
  price: number | null;
  status: string | null;
};

type Payment = {
  id: string;
  applicationId: string | null;
  customerName: string | null;
  mobile: string | null;
  serviceName: string | null;
  amount: number | null;
  paymentMethod: string | null;
  transactionId: string | null;
  status: string | null;
  paidAt: string | null;
  createdAt: string;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

function Payments() {
  const [searchParams] =
    useSearchParams();

  const applicationId =
    searchParams.get("applicationId");

  const [application, setApplication] =
    useState<Application | null>(null);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [paying, setPaying] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /*
   * Load Razorpay Checkout script
   */

  const loadRazorpayScript =
    () => {
      return new Promise<boolean>(
        (resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }

          const existingScript =
            document.querySelector(
              'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

          if (existingScript) {
            existingScript.addEventListener(
              "load",
              () => resolve(true)
            );

            existingScript.addEventListener(
              "error",
              () => resolve(false)
            );

            return;
          }

          const script =
            document.createElement(
              "script"
            );

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.async = true;

          script.onload = () =>
            resolve(true);

          script.onerror = () =>
            resolve(false);

          document.body.appendChild(
            script
          );
        }
      );
    };

  /*
   * Load application and payment history
   */

  const loadPaymentData =
    async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        if (!applicationId) {
          setError(
            "Application ID is missing. Please open the payment page from your application."
          );

          setLoading(false);
          return;
        }

        /*
         * Load application
         */

        const {
          data: applicationData,
          error: applicationError,
        } = await supabase
          .from("applications")
          .select(
            "id, customerName, mobile, serviceName, price, status"
          )
          .eq(
            "id",
            applicationId
          )
          .single();

        if (applicationError) {
          console.error(
            "Application Load Error:",
            applicationError
          );

          throw applicationError;
        }

        if (!applicationData) {
          throw new Error(
            "Application not found."
          );
        }

        setApplication(
          applicationData as Application
        );

        /*
         * Load payment history
         */

        const {
          data: paymentData,
          error: paymentError,
        } = await supabase
          .from("payments")
          .select("*")
          .eq(
            "applicationId",
            applicationId
          )
          .order(
            "createdAt",
            {
              ascending: false,
            }
          );

        if (paymentError) {
          console.error(
            "Payment History Error:",
            paymentError
          );

          throw paymentError;
        }

        setPayments(
          (paymentData ||
            []) as Payment[]
        );
      } catch (err: any) {
        console.error(
          "Payment Page Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load payment information."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadPaymentData();
  }, [applicationId]);

  /*
   * Verify Razorpay payment
   */

  const verifyPayment =
    async (
      response: any
    ) => {
      if (!application) {
        throw new Error(
          "Application information is not available."
        );
      }

      if (
        !response?.razorpay_order_id ||
        !response?.razorpay_payment_id ||
        !response?.razorpay_signature
      ) {
        throw new Error(
          "Razorpay did not return complete payment verification information."
        );
      }

      const {
        data: verificationData,
        error: verificationError,
      } =
        await supabase.functions.invoke(
          "verify-razorpay-payment",
          {
            body: {
              applicationId:
                application.id,

              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,
            },
          }
        );

      if (verificationError) {
        console.error(
          "Payment Verification Function Error:",
          verificationError
        );

        throw verificationError;
      }

      if (
        !verificationData ||
        !verificationData.success
      ) {
        throw new Error(
          verificationData?.error ||
            "Payment verification failed."
        );
      }

      return verificationData;
    };

  /*
   * Start Razorpay payment
   */

  const handlePayNow =
    async () => {
      try {
        setPaying(true);
        setError("");
        setSuccessMessage("");

        if (!application) {
          setError(
            "Application information is not available."
          );
          return;
        }

        /*
         * Check existing successful payment
         */

        const successfulPayment =
          payments.find(
            (payment) => {
              const status =
                payment.status?.toLowerCase();

              return (
                status === "success" ||
                status === "completed"
              );
            }
          );

        if (successfulPayment) {
          setSuccessMessage(
            "This application has already been paid successfully."
          );

          return;
        }

        /*
         * Load Razorpay Checkout
         */

        const razorpayLoaded =
          await loadRazorpayScript();

        if (!razorpayLoaded) {
          throw new Error(
            "Unable to load Razorpay Checkout. Please check your internet connection and try again."
          );
        }

        /*
         * Create Razorpay Order
         */

        const {
          data: orderData,
          error: functionError,
        } =
          await supabase.functions.invoke(
            "create-razorpay-order",
            {
              body: {
                applicationId:
                  application.id,
              },
            }
          );

        if (functionError) {
          console.error(
            "Razorpay Function Error:",
            functionError
          );

          throw functionError;
        }

        if (
          !orderData ||
          !orderData.success
        ) {
          throw new Error(
            orderData?.error ||
              "Unable to create Razorpay order."
          );
        }

        /*
         * Razorpay Checkout options
         */

        const options = {
          key:
            orderData.keyId,

          amount:
            orderData.amount,

          currency:
            orderData.currency ||
            "INR",

          name: "VERIXA",

          description:
            application.serviceName ||
            "Service Payment",

          order_id:
            orderData.orderId,

          prefill: {
            name:
              application.customerName ||
              "",

            contact:
              application.mobile
                ? `+91${application.mobile}`
                : "",
          },

          notes: {
            applicationId:
              application.id,
          },

          theme: {
            color: "#2563eb",
          },

          modal: {
            confirm_close: true,
            escape: true,
            backdropclose: false,
          },

          /*
           * Razorpay successful response
           * must be verified by Supabase.
           */

          handler:
            async (
              response: any
            ) => {
              try {
                setPaying(true);
                setError("");

                setSuccessMessage(
                  "Payment received. Verifying payment..."
                );

                /*
                 * Server-side verification
                 */

                const verification =
                  await verifyPayment(
                    response
                  );

                console.log(
                  "Payment Verification Result:",
                  verification
                );

                /*
                 * Reload payment history
                 */

                await loadPaymentData();

                setSuccessMessage(
                  verification?.alreadyPaid
                    ? "This application was already marked as paid."
                    : "Payment verified successfully. Your payment information has been updated."
                );
              } catch (
                err: any
              ) {
                console.error(
                  "Payment Verification Error:",
                  err
                );

                setError(
                  err?.message ||
                    "Payment was received but verification failed. Please contact support."
                );

                setSuccessMessage(
                  ""
                );
              } finally {
                setPaying(false);
              }
            },
        };

        /*
         * Open Razorpay Checkout
         */

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.on(
          "payment.failed",
          (
            response: any
          ) => {
            console.error(
              "Razorpay Payment Failed:",
              response
            );

            setError(
              response?.error
                ?.description ||
                "Payment failed. Please try again."
            );

            setSuccessMessage(
              ""
            );
          }
        );

        razorpay.open();
      } catch (
        err: any
      ) {
        console.error(
          "Payment Creation Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to start payment."
        );
      } finally {
        setPaying(false);
      }
    };

  /*
   * Format date
   */

  const formatDate =
    (
      date: string | null
    ) => {
      if (!date) {
        return "-";
      }

      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          dateStyle:
            "medium",
          timeStyle:
            "short",
        }
      );
    };

  /*
   * Status class
   */

  const getStatusClass =
    (
      status: string | null
    ) => {
      switch (
        status?.toLowerCase()
      ) {
        case "success":
        case "completed":
          return "bg-green-100 text-green-700";

        case "failed":
          return "bg-red-100 text-red-700";

        case "refunded":
          return "bg-purple-100 text-purple-700";

        case "pending":
        default:
          return "bg-yellow-100 text-yellow-700";
      }
    };

  /*
   * Status icon
   */

  const getStatusIcon =
    (
      status: string | null
    ) => {
      switch (
        status?.toLowerCase()
      ) {
        case "success":
        case "completed":
          return (
            <CheckCircle
              size={18}
              className="text-green-600"
            />
          );

        case "failed":
          return (
            <XCircle
              size={18}
              className="text-red-600"
            />
          );

        case "pending":
          return (
            <Clock
              size={18}
              className="text-yellow-600"
            />
          );

        default:
          return (
            <Clock
              size={18}
              className="text-gray-500"
            />
          );
      }
    };

  /*
   * Loading
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-gray-600 font-medium">
          Loading payment information...
        </p>
      </div>
    );
  }

  /*
   * Error
   */

  if (
    error &&
    !application
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
          <XCircle
            size={55}
            className="mx-auto text-red-500"
          />

          <h1 className="text-2xl font-bold text-slate-800 mt-5">
            Payment Page Error
          </h1>

          <p className="text-red-600 mt-4 break-words">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              type="button"
              onClick={
                loadPaymentData
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Try Again
            </button>

            <Link
              to="/dashboard"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amount =
    Number(
      application?.price || 0
    );

  const successfulPayment =
    payments.find(
      (payment) => {
        const status =
          payment.status?.toLowerCase();

        return (
          status === "success" ||
          status === "completed"
        );
      }
    );

  /*
   * Main UI
   */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6"
          >
            <ArrowLeft
              size={19}
            />

            Back to Dashboard
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold">
            Payment
          </h1>

          <p className="text-blue-100 mt-2">
            Complete payment for your service application
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <XCircle
                size={22}
                className="text-red-500 mt-0.5"
              />

              <div>
                <p className="font-bold text-red-700">
                  Payment Error
                </p>

                <p className="text-red-600 mt-1 break-words">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle
                size={22}
                className="text-green-600 mt-0.5"
              />

              <div>
                <p className="font-bold text-green-700">
                  Payment Update
                </p>

                <p className="text-green-600 mt-1">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Application / Payment Card */}

          <div className="bg-white rounded-3xl shadow-xl p-7 md:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard
                  className="text-blue-600"
                  size={25}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Pay Service Fee
                </h2>

                <p className="text-gray-500">
                  Application payment
                </p>
              </div>
            </div>

            {/* Service */}

            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-gray-500 text-sm">
                Service
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-1">
                {application?.serviceName ||
                  "-"}
              </h3>

              <div className="border-t border-blue-100 mt-5 pt-5">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Customer
                  </span>

                  <span className="font-semibold text-right">
                    {application?.customerName ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 mt-3">
                  <span className="text-gray-500">
                    Mobile
                  </span>

                  <span className="font-semibold">
                    {application?.mobile ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 mt-3">
                  <span className="text-gray-500">
                    Application ID
                  </span>

                  <span className="font-mono text-sm font-semibold break-all text-right">
                    {application?.id ||
                      "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount */}

            <div className="flex items-center justify-between mt-7 p-5 border rounded-2xl">
              <div className="flex items-center gap-2">
                <IndianRupee
                  size={21}
                  className="text-green-600"
                />

                <span className="font-semibold text-gray-600">
                  Amount Payable
                </span>
              </div>

              <span className="text-3xl font-bold text-green-600">
                ₹{amount}
              </span>
            </div>

            {/* Pay button */}

            {successfulPayment ? (
              <div className="mt-7">
                <div className="w-full bg-green-100 text-green-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle
                    size={21}
                  />

                  Payment Successful
                </div>

                {successfulPayment.transactionId && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Razorpay Payment ID:{" "}
                    <span className="font-mono">
                      {
                        successfulPayment.transactionId
                      }
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={
                  handlePayNow
                }
                disabled={paying}
                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition"
              >
                {paying ? (
                  <>
                    <RefreshCw
                      size={21}
                      className="animate-spin"
                    />

                    Verifying Payment...
                  </>
                ) : (
                  <>
                    <CreditCard
                      size={21}
                    />

                    Pay ₹{amount}
                  </>
                )}
              </button>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
              Secure payment powered by Razorpay.
            </p>
          </div>

          {/* Payment Information */}

          <div className="bg-white rounded-3xl shadow-xl p-7 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Receipt
                  className="text-green-600"
                  size={25}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Payment Information
                </h2>

                <p className="text-gray-500">
                  Current payment status
                </p>
              </div>
            </div>

            {/* Payment History */}

            <div className="mt-7 space-y-4">
              {payments.length ===
              0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <Receipt
                    size={35}
                    className="mx-auto text-gray-400"
                  />

                  <p className="text-gray-500 mt-3">
                    No payment attempts yet.
                  </p>
                </div>
              ) : (
                payments.map(
                  (payment) => (
                    <div
                      key={
                        payment.id
                      }
                      className="border rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800">
                            {payment.paymentMethod ||
                              "Payment"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(
                              payment.createdAt
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusIcon(
                            payment.status
                          )}

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status ||
                              "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4 pt-4 border-t">
                        <span className="text-gray-500">
                          Amount
                        </span>

                        <span className="font-bold text-green-600">
                          ₹
                          {Number(
                            payment.amount ||
                              0
                          )}
                        </span>
                      </div>

                      {payment.transactionId && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">
                            Razorpay Payment ID
                          </p>

                          <p className="font-mono text-xs break-all mt-1 text-gray-700">
                            {
                              payment.transactionId
                            }
                          </p>
                        </div>
                      )}

                      {payment.paidAt && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">
                            Paid At
                          </p>

                          <p className="text-sm font-semibold mt-1">
                            {formatDate(
                              payment.paidAt
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;