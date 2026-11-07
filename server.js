const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("ANKITA AI 3.0 Backend is Running!");
});

app.post("/brain", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API Key is not configured"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `
          তোমার নাম ANKITA।
          তুমি একটি Personal AI Voice Assistant।
          বন্ধুত্বপূর্ণভাবে কথা বলবে।
          বাংলা, ইংরেজি ও অন্যান্য ভাষা বুঝবে।
          ব্যবহারকারীর ভাষাতেই উত্তর দেবে।
          উত্তর সহজ, সুন্দর ও সংক্ষিপ্ত রাখবে।
        `
      }
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("ANKITA AI Error:", error.message);

    res.status(500).json({
      error: "ANKITA AI Brain is not responding"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("ANKITA AI 3.0 Server Running on " + PORT);
});
