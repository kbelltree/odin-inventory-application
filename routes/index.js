const { Router } = require('express');
const inventoryManager = require('../controllers/inventoryManager');
const validationManager = require('../controllers/validationManager');
const asyncHandler = require('express-async-handler');

const index = Router();

index.get('/', inventoryManager.getStoredSizes);

index.get('/new-size', inventoryManager.createNewSizeGet);

index.post(
  '/new-size',
  validationManager.validateSize,
  inventoryManager.createNewSizePost
);

// TODO: add middleware that handles directing to password entry form page
index.get(
  '/size/delete/:sizeId/authorize-delete',
  inventoryManager.confirmDeleteSizeGet
);

index.delete('/size/delete/:sizeId', asyncHandler(inventoryManager.deleteSize));

index.get('/size/:sizeTitle/new-item', inventoryManager.createNewItemGet);

index.post(
  '/size/:sizeTitle/new-item',
  validationManager.validateItem,
  inventoryManager.createNewItemPost
);

index.get(
  '/size/:sizeTitle/delete/:itemId/authorize-delete',
  inventoryManager.confirmDeleteItemGet
);

index.delete(
  '/size/:sizeTitle/delete/:itemId',
  asyncHandler(inventoryManager.deleteItem)
);

index.patch(
  '/size/:sizeTitle/edit/:itemId',
  validationManager.validateItem,
  asyncHandler(inventoryManager.editItemDetailsPost)
);

index.get(
  '/size/:sizeTitle/:itemId',
  asyncHandler(inventoryManager.getDetailsByItemId)
);

index.get('/size/:sizeTitle', asyncHandler(inventoryManager.getItemsBySize));

index.get('/size', asyncHandler(inventoryManager.getItemsBySize));

module.exports = index;
