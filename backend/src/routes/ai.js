// backend/src/routes/ai.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

// // ✅ Load .env variables at the very top
dotenv.config();

const router = express.Router();

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { messages } = req.body;
  console.log("Incoming messages:", messages);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    console.log("OpenAI response:", response);
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
  console.error("AI route error:", err);
  if (err.code === "insufficient_quota") {
    res.status(429).json({ error: "AI quota exceeded. Please try again later." });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
}

});


export default router;
