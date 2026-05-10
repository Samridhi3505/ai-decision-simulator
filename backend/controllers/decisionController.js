import Decision from "../models/decision.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Gemini Configuration
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ✅ CREATE DECISION
export const createDecision = async (req, res) => {

  try {

    const { title, options } = req.body;

    console.log("BODY:", req.body);

    // ✅ Validation
    if (
      !title ||
      !Array.isArray(options) ||
      options.length === 0
    ) {

      return res.status(400).json({
        msg: "Invalid input"
      });
    }

    // ✅ Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // ✅ Dynamic AI Prompt
    const prompt = `
You are an intelligent AI decision-making assistant.

Your task is to carefully analyze the user's situation and compare all options intelligently.

Question:
${title}

Options:
${options.map((o, i) => `${i + 1}. ${o}`).join("\n")}

Instructions:
- Compare all options carefully
- Explain strengths and weaknesses of each option
- Give meaningful pros and cons
- Select the best option based on the situation
- Explain WHY the option is best
- Respond naturally like a real AI assistant
- Keep the response detailed but easy to understand

Response Format:

👉 Introduction

Detailed comparison of each option

Pros and cons of each option

Final recommendation

✅ Best Option: <option>
`;

    // ✅ Generate AI Response
    const aiResult = await model.generateContent(prompt);

    const result = aiResult.response.text();

    console.log("GEMINI RESPONSE:", result);

    // ✅ Save to MongoDB
    await Decision.create({
      userId: req.user.id,
      title,
      result
    });

    // ✅ Keep only latest 7 decisions
    const all = await Decision.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    if (all.length > 7) {

      const idsToDelete = all
        .slice(7)
        .map((d) => d._id);

      await Decision.deleteMany({
        _id: { $in: idsToDelete }
      });
    }

    // ✅ Send response
    res.json({
      result
    });

  } catch (err) {

    console.error("AI ERROR:", err);

    res.status(500).json({
      msg:
        err.message ||
        "AI decision failed"
    });
  }
};

// ✅ GET HISTORY
export const getDecisions = async (req, res) => {

  try {

    const data = await Decision.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Error fetching decisions"
    });
  }
};

// ✅ DELETE DECISION
export const deleteDecision = async (req, res) => {

  try {

    const decision = await Decision.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!decision) {

      return res.status(404).json({
        msg: "Decision not found"
      });
    }

    await decision.deleteOne();

    res.json({
      msg: "Deleted successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Error deleting decision"
    });
  }
};