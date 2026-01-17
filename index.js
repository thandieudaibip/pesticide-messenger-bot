const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 🔐 Page Access Token (lấy từ biến môi trường)
const PAGE_TOKEN = process.env.PAGE_TOKEN;

// 🔐 Verify Token (PHẢI TRÙNG với Facebook)
const VERIFY_TOKEN = "verify_bot";

/* =======================
   VERIFY WEBHOOK
======================= */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/* =======================
   NHẬN TIN NHẮN
======================= */
app.post("/webhook", (req, res) => {
  const entry = req.body.entry?.[0];
  const event = entry?.messaging?.[0];

  if (event && event.message && event.message.text) {
    const senderId = event.sender.id;
    const text = event.message.text.toLowerCase();

    if (text.includes("giá")) {
      sendText(
        senderId,
        "💰 BÁO GIÁ THUỐC BVTV:\n" +
        "- Thuốc trừ sâu: 120.000đ\n" +
        "- Thuốc trừ bệnh: 95.000đ\n" +
        "📞 Liên hệ để tư vấn chi tiết"
      );
    } else {
      sendText(
        senderId,
        "👋 Chào anh/chị!\n" +
        "🌱 Bot tư vấn thuốc BVTV\n" +
        "👉 Gõ: GIÁ để xem báo giá"
      );
    }
  }

  res.sendStatus(200);
});

/* =======================
   GỬI TIN NHẮN
======================= */
function sendText(id, text) {
  axios.post(
    `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_TOKEN}`,
    {
      recipient: { id },
      message: { text },
    }
  );
}

/* =======================
   PORT (RẤT QUAN TRỌNG)
======================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🤖 Bot dang chay tren port " + PORT);
});
