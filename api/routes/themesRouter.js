const {
    getAllThemes,
    getThemeById,
    getImagesByThemeId
} = require("../helpers");

const router = require("express").Router();

// GET all themes
router.get("/", async (req, res) => {
    try {
        const themes = await getAllThemes();
        if (themes) {
        return res.status(200).json(themes);
        } else {
        res.status(400).send({ message: "Themes not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

// GET theme by id
router.get("/:id", (req, res) => {
    getThemeById(req.params.id)
      .then(theme => {
        if (theme) {
          res.status(200).json(theme);
        } else {
          res.status(400).json({ message: "There's no theme with this id" });
        }
      })
      .catch(err => {
        return res.status(500).send(err);
      });
});

// GET all images for theme id
router.get("/:id/images", (req, res) => {
    getImagesByThemeId(req.params.id)
      .then(images => {
        if (images) {
          return res.status(200).json(images);
        } else {
          res.status(400).send({ message: "Images for this user not found" });
        }
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  });

module.exports = router;