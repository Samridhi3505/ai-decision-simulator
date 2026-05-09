import Decision from "../models/decision.js";

// ✅ CREATE DECISION (with AI)
export const createDecision = async (req, res) => {
  try {
    const { title, options } = req.body;

    console.log("BODY:", req.body); // debug

    if (!title || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    const prompt = `
You are a smart decision-making assistant.

Situation:
${title}

Options:
${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}

Analyze and provide:
- Pros & Cons
- Final Recommendation
- Best Option: <option>
`;

    // 🤖 CALL OLLAMA
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "phi",
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    console.log("OLLAMA RESPONSE:", data);
    if (!data || !data.response) {
  return res.status(500).json({ msg: "AI did not return valid response" });
}
    const result = data?.response || "";

    // 💾 SAVE
    const newDecision = await Decision.create({
      userId: req.user.id,
      title,
      result
    });

    // 🔥 KEEP ONLY LAST 7
    const all = await Decision.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (all.length > 7) {
      const idsToDelete = all.slice(7).map(d => d._id);
      await Decision.deleteMany({ _id: { $in: idsToDelete } });
    }
res.json({
  result: result || "⚠️ AI could not generate a proper response"
});
   

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ msg: "AI decision failed" });
  }
};

// ✅ GET HISTORY
export const getDecisions = async (req, res) => {
  try {
    const data = await Decision.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching decisions" });
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
      return res.status(404).json({ msg: "Not found" });
    }

    await decision.deleteOne();

    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting decision" });
  }
};