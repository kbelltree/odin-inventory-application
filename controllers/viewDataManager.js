const db = require('../db/queries');

// Store rarely changing data set to avoid re-fetching from database
let currentSizes = null;

// Store sizes to locals for use in multiple Views
async function setSizesAsLocals(req, res, next) {
  try {
    // Limit fetching by checking the currentSizes
    if (!currentSizes) {
      currentSizes = await db.getAllSizes();
    }
    res.locals.sizes = currentSizes;
    next();
  } catch (err) {
    next(err);
  }
}

// Call this function after adding or deleting a size to ensure setSizesAsLocals fetches updated data via app middleware
function resetCurrentSizes() {
  currentSizes = null;
}

module.exports = {
  setSizesAsLocals,
  resetCurrentSizes,
};
