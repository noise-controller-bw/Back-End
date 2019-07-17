const router = require("express").Router();
const {
  findSessions,
  findSessionsById,
  addSessions,
  removeSessions,
  updateSessions
} = require("../helpers");

router.get("/", async (req, res) => {
  try {
    const sessions = await findSessions();
    res.status(200).json(sessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "We ran into an error retrieving the sessions", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sessions = await findSessionsById(req.params.id);
    if (sessions) {
      res.status(200).json(sessions);
    } else {
      res.status(404).json({ message: "We could not find the session" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "We ran into an error retrieving the session", error });
  }
});

router.post("/", async (req, res) => {
  const sessions = req.body;

  if (!sessions.date || !sessions.score || !sessions.lessonName) {
    res
      .status(400)
      .json({ message: "Please provided required fields to create sessions" });
  } else {
    try {
      const inserted = await addSessions(sessions);
      res.status(201).json(inserted);
    } catch (error) {
      res
        .status(500)
        .json({ message: "We ran into an error creating the session", error });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedSessions = {
      id: req.params.id.toString(),
      ...req.body
    };
    const session = await updateSessions(req.params.id.toString(), req.body);
    if (session) {
      res
        .status(200)
        .json({ message: "The session has been updated", updatedSessions });
    } else {
      res.status(404).json({ message: "The session could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating the session",
      error
    });
  }
});

//can add check role mw here for delete
router.delete("/:id", async (req, res) => {
  try {
    const count = await removeSessions(req.params.id.toString());
    if (count > 0) {
      res.status(200).json({ message: "The session has been deleted", count });
    } else {
      res.status(404).json({
        message: "That session does not exist, perhaps it was deleted already"
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "We ran into an error removing the session", error });
  }
});

module.exports = router;
