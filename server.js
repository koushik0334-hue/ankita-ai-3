const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Server test
app.get("/", (req, res) => {
  res.send("ANKITA AI 3.0 Backend is Running!");
});

// ANKITA AI Brain
app.post("/brain", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OpenAI API Key is not configured"
      });
    }

    const ai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await ai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: `
        তোমার নাম ANKITA।
        তুমি একটি Personal AI Voice Assistant।
        ব্যবহারকারীর সঙ্গে বন্ধুত্বপূর্ণভাবে কথা বলবে।
        বাংলা, ইংরেজি এবং অন্যান্য ভাষা বুঝবে।
        ব্যবহারকারী যে ভাষায় কথা বলবে,
        সেই ভাষাতেই উত্তর দেবে।
        উত্তর সহজ, সুন্দর ও সংক্ষিপ্ত রাখবে।
      `,
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("ANKITA AI Error:", error.message);

    res.status(500).json({
      error: "ANKITA AI Brain is not responding"
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("ANKITA AI 3.0 Server Running on " + PORT);
)};
