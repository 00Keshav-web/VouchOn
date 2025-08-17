// ==== IMPORTS ====
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto"); // 👈 for signature verification

// ==== APP CONFIG ====
const app = express();
app.use(express.json());
app.use(cors());

// ==== RAZORPAY INSTANCE FOR BUYER PAYMENTS ====
const razorpay = new Razorpay({
  key_id: "rzp_test_R5mqqaNbEl5Mqd",         // from Razorpay Dashboard
  key_secret: "JLZRvbhftFBK6QNVY0LYqXQf"     // keep secret, never send to frontend
});

// ==== Utility: VERIFY SIGNATURE ====
function verifyPaymentSignature(orderId, paymentId, signature) {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", "JLZRvbhftFBK6QNVY0LYqXQf") // use Razorpay secret
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
}

// ==== 1️⃣ CREATE ORDER FOR BUYER ====
app.post("/create-order", async (req, res) => {
  const amount = Number( req.body.amount); // amount in paise
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  
  console.log("Received amount:", amount); // debug log
  try {
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "order_" + Date.now()
    });
    res.json(order); // send order details to frontend
  } catch (err) {
    console.error("Order creation failed:", err); // log error to console
    res.status(500).json({ error: err.message });
  }
});

// ==== 2️⃣ VERIFY PAYMENT (AFTER SUCCESS ON FRONTEND) ====
app.post("/verify-payment", (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const isValid = verifyPaymentSignature(orderId, paymentId, signature);

  if (isValid) {
    // ✅ Payment is real
    res.json({ success: true, message: "Payment verified successfully" });

    // 👉 Here you can: 
    // - Mark order as paid in DB
    // - Credit wallet / deliver vouchers
  } else {
    // ❌ Possible fraud / tampering
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

// ==== START SERVER ====
app.listen(3000, () => console.log("✅ Server running on port 3000"));
