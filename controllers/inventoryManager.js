const db = require('../db/queries');
const viewDataManager = require('./viewDataManager');
const { validationResult } = require('express-validator');
const ADMIN_PW = process.env.ADMIN_PW;
// NOTE: Always add a 'return' statement after res.render/res.redirect to exit the JS function.
// This prevents unintended code from running after a response has been sent.

function getStoredSizes(req, res) {
  return res.render('sizes', {
    headingTitle: 'Print Sizes',
    sizes: res.locals.sizes,
  });
}

function createNewSizeGet(req, res) {
  return res.render('formSize', { message: null, sizeTitle: null });
}

function createNewItemGet(req, res) {
  const { sizeTitle } = req.params;
  return res.render('formItem', {
    formTitle: 'New Item',
    message: null,
    urlPath: sizeTitle,
    sizes: res.locals.sizes,
    item: null,
  });
}

async function createNewSizePost(req, res) {
  const { size } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('formSize', {
      message: null,
      errors: errors.array(),
      sizeTitle: size,
    });
  }
  const rowCount = await db.insertNewSize(size);
  if (rowCount === 0) {
    return res.render('formSize', {
      message: 'Only a unique size can be added.',
      sizeTitle: size,
    });
  } else {
    viewDataManager.resetCurrentSizes();
    return res.redirect('/');
  }
}

async function createNewItemPost(req, res) {
  const { sizeTitle } = req.params;
  const { title, size, sizeId, quantity } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('formItem', {
      formTitle: 'New Item',
      message: null,
      urlPath: sizeTitle,
      sizes: res.locals.sizes,
      item: { title: title, size: size, size_id: sizeId, quantity: quantity },
      errors: errors.array(),
    });
  }
  await db.insertNewItem(title, sizeId, quantity);
  return res.redirect('/size/all');
}

async function getItemsBySize(req, res) {
  const size = req.params.sizeTitle || req.query.size;
  const sizeId = await db.getSizeIdBySize(size);
  if (!sizeId) {
    return res
      .status(404)
      .render('errorPage', { message: `${size} could not be found.` });
  }
  const items = await db.getItemsBySizeId(sizeId);
  return res.render('items', { items: items, urlPath: size });
}

async function getDetailsByItemId(req, res) {
  const { sizeTitle, itemId } = req.params;
  const item = await db.getItemDataById(itemId);
  if (!item) {
    return res.status(404).render('errorPage', {
      message: `The item does not exist by itemId - ${itemId}`,
    });
  }
  return res.render('formUpdateItem', {
    formTitle: item.title,
    message: null,
    urlPath: sizeTitle,
    sizes: res.locals.sizes,
    item: item,
  });
}

async function editItemDetailsPost(req, res) {
  const { sizeTitle, itemId } = req.params;
  const { title, sizeId, quantity, adminPW } = req.body;
  if (ADMIN_PW !== adminPW) {
    return res.status(401).render('formUpdateItem', {
      formTitle: title,
      message: 'Incorrect password. Update request denied.',
      urlPath: sizeTitle,
      sizes: res.locals.sizes,
      item: { id: itemId, title: title, size_id: sizeId, quantity: quantity },
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('formUpdateItem', {
      formTitle: title,
      message: null,
      urlPath: sizeTitle,
      sizes: res.locals.sizes,
      item: { id: itemId, title: title, size_id: sizeId, quantity: quantity },
      errors: errors.array(),
    });
  }
  const result = await db.updateItemData(itemId, title, sizeId, quantity);
  return res.render('formUpdateItem', {
    formTitle: result.title,
    message: `The details are updated.`,
    urlPath: sizeTitle,
    sizes: res.locals.sizes,
    item: result,
  });
}

function confirmDeleteItemGet(req, res) {
  const { sizeTitle, itemId } = req.params;
  return res.render('formPassword', {
    deleteType: 'the item',
    formAction: `/size/${sizeTitle}/delete/${itemId}?_method=DELETE`,
    message: null,
    redirectURL: `/size/${sizeTitle}`,
  });
}

async function deleteItem(req, res) {
  const { adminPW } = req.body;
  const { sizeTitle, itemId } = req.params;
  if (ADMIN_PW !== adminPW) {
    return res.status(401).render('formPassword', {
      deleteType: 'item',
      formAction: `/size/${sizeTitle}/delete/${itemId}?_method=DELETE`,
      message: 'Incorrect password. Delete request denied.',
      redirectURL: `/size/${sizeTitle}`,
    });
  }
  const rowCount = await db.deleteItemData(itemId);
  if (rowCount === 0) {
    return res.status(404).render('errorPage', {
      message: 'Could not find matching item Id.',
    });
  }
  return res.redirect(`/size/${sizeTitle}`);
}

function confirmDeleteSizeGet(req, res) {
  const { sizeId } = req.params;
  return res.render('formPassword', {
    deleteType: 'the size',
    formAction: `/size/delete/${sizeId}?_method=DELETE`,
    message: null,
    redirectURL: '/',
  });
}

async function deleteSize(req, res) {
  const { adminPW } = req.body;
  const { sizeId } = req.params;
  if (ADMIN_PW !== adminPW) {
    return res.status(401).render('formPassword', {
      deleteType: 'size',
      formAction: `/size/delete/${sizeId}?_method=DELETE`,
      message: 'Incorrect password. Delete request denied.',
      redirectURL: '/',
    });
  }
  try {
    const rowCount = await db.deleteSizeData(sizeId);
    if (rowCount === 0) {
      return res.status(404).render('errorPage', {
        message: 'Size not found.',
      });
    }
    viewDataManager.resetCurrentSizes();
    return res.redirect('/');
  } catch (err) {
    // In case foreign key violation
    if (err.code == '23503') {
      return res.status(400).render('errorPage', {
        message: 'Cannot delete this size because it still contains items.',
      });
    }
    // Equivalent to calling 'next(err)' when using asyncHandler middleware
    throw err;
  }
}

module.exports = {
  getStoredSizes,
  getItemsBySize,
  createNewSizeGet,
  createNewItemGet,
  createNewSizePost,
  createNewItemPost,
  getDetailsByItemId,
  editItemDetailsPost,
  confirmDeleteSizeGet,
  confirmDeleteItemGet,
  deleteItem,
  deleteSize,
};
