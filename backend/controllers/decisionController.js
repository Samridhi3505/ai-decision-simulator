import Decision from "../models/decision.js";

// ✅ CREATE DECISION
export const createDecision = async (req, res) => {
  try {

    const { title, options } = req.body;

    console.log("BODY:", req.body);

    // ✅ Validation
    if (!title || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({
        msg: "Invalid input"
      });
    }

    // ✅ Simple AI-style Response
    const result = `
AI Decision Analysis

Situation:
${title}

Options:
${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}

Recommended Option:
${options[0]}

Reason:
Based on the provided options, this appears to be the most balanced and practical choice considering overall usability, simplicity, and effectiveness.

Pros:
- Easy to implement
- Practical option
- Balanced decision

Cons:
- May require further evaluation
- Depends on personal preference
`;

    // ✅ Save to MongoDB
    const newDecision = await Decision.create({
      userId: req.user.id,
      title,
      result
    });

    // ✅ Keep Only Latest 7 Decisions
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

    // ✅ Send Response
    res.json({
      result
    });

  } catch (err) {

    console.error("AI ERROR:", err);

    res.status(500).json({
      msg: "AI decision failed"
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