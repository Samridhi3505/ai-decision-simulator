import Decision from "../models/decision.js";
import Groq from "groq-sdk";

// ✅ CREATE DECISION
export const createDecision = async (req, res) => {
  try {

    // ✅ Groq Initialization
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { title, options } = req.body;

    console.log("BODY:", req.body);

    // ✅ Validation
    if (
      !title ||
      !Array.isArray(options) ||
      options.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid input",
      });
    }

    // ✅ Better Structured Prompt
    const prompt = `
You are an intelligent AI decision-making assistant.

Analyze the user's question carefully and compare all options properly.

QUESTION:
${title}

OPTIONS:
${options.map((o, i) => `${i + 1}. ${o}`).join("\n")}

INSTRUCTIONS:
- Compare every option clearly
- Use bullet points everywhere
- Keep response structured and readable
- Mention advantages and disadvantages
- Give practical reasoning
- Keep language simple and professional
- Final answer must be concise and clear

FORMAT RESPONSE EXACTLY LIKE THIS:

# Introduction
- Short overview of the decision

# Option Analysis

## Option 1: <name>
Pros:
- point
- point

Cons:
- point
- point

## Option 2: <name>
Pros:
- point
- point

Cons:
- point
- point

(continue for all options)

# Final Recommendation
- Explain best option briefly
- Explain why it is best

# ✅ Best Option
- Mention only the best option name
`;

    // ✅ Groq AI Response
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You are a smart AI decision assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.4,
        max_tokens: 1024,
      });

    // ✅ Extract AI Response
    const result =
      completion.choices[0]?.message?.content ||
      "No response generated";

    console.log("GROQ RESPONSE:", result);

    // ✅ Save to MongoDB
    await Decision.create({
      userId: req.user.id,
      title,
      result,
    });

    // ✅ Keep only latest 7 decisions
    const all = await Decision.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    if (all.length > 7) {

      const idsToDelete = all
        .slice(7)
        .map((d) => d._id);

      await Decision.deleteMany({
        _id: { $in: idsToDelete },
      });
    }

    // ✅ Send Response
    res.json({
      result,
    });

  } catch (err) {

    console.error("GROQ AI ERROR:", err);

    res.status(500).json({
      msg:
        err.message ||
        "AI decision failed",
    });
  }
};

// ✅ GET HISTORY
export const getDecisions = async (req, res) => {

  try {

    const data = await Decision.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Error fetching decisions",
    });
  }
};

// ✅ DELETE DECISION
export const deleteDecision = async (req, res) => {

  try {

    const decision = await Decision.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!decision) {

      return res.status(404).json({
        msg: "Decision not found",
      });
    }

    await decision.deleteOne();

    res.json({
      msg: "Deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Error deleting decision",
    });
  }
};