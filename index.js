// import dependensi
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

import "dotenv/config";
//installasi app
//
const app = express();
const upload = multer();

const ai = new GoogleGenAI({});

app.use(cors());
app.use(express.json());

app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  console.log({ prompt });

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({
      succes: false,
      message: "prompt harus berupa string!",
      data: null,
    });
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
      config: {
        systemInstruction: "Harus dibalas dalam bahasa sunda",
      },
    });

    res.status(200).json({
      succes: true,
      message: "berhasil dijawab oleh Gemini",
      data: aiResponse.text,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      succes: "false",
      message: "gagal lur, server lagu lagi mumet kayanya",
      data: null,
    });
  }
});

app.listen(3000, () => {
  console.log("I Love U 3000");
});
