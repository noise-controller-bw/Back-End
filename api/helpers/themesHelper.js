const db = require("../../data/dbConfig.js");

module.exports = {
    getAllThemes,
    getThemeById,
    getImagesByThemeId
};

// GET ALL themes
// Must return all themes or empty array
function getAllThemes() {
    return db("themes");
}


// GET theme by ID
// Must return theme object
function getThemeById(id) {
    return db("themes")
      .where({ id })
      .first();
}

// GET images by THEME ID
// Must return an array of objects
function getImagesByThemeId(theme_id) {
    return db("themes as t")
      .join("images as i", "t.id", "i.theme_id")
      .select("i.id", "i.url")
      .where("t.id", theme_id);
}