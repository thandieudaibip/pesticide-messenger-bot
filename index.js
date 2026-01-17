const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PAGE_TOKEN = process.env.PAGE_TOKEN;

// Xác minh webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "verify_bot";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Nhận tin nhắn
app.post("/webhook", (req, res) => {
  const entry = req.body.entry[0];
  const webhookEvent = entry.messaging[0];
  const senderId = webhookEvent.sender.id;

  if (webhookEvent.message && webhookEvent.message.text) {
    const text = webhookEvent.message.text.toLowerCase();

    if (text.includes("giá")) {
      sendText(
        senderId,
        "💰 BÁO GIÁ THUỐC BVTV:\n- Thuốc trừ sâu: 120.000đ\n- Thuốc trừ bệnh: 95.000đ"
      );
    } else {
      sendText(
        senderId,
        "👋 Chào bạn!\nMình là bot tư vấn thuốc BVTV 🌱\n👉 Gõ:\n- giá\n- sản phẩm"
      );
    }
  }

  res.sendStatus(200);
});

function sendText(id, text) {
  axios.post(
    `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_TOKEN}`,
    {
      recipient: { id },
      message: { text },
    }
  );
}

app.listen(3000, () => {
  console.log("Bot đang chạy...");
}); 
