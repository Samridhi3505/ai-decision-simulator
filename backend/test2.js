import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: "./.env" });

async function run() {

  try {

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-001"
    });

    const result = await model.generateContent(
      "Hello"
    );

    console.log(result.response.text());

  } catch (err) {

    console.error(err);

  }
}

run();