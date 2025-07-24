const pool = require('./pool');

async function getAllSizes() {
  const { rows } = await pool.query('SELECT * FROM sizes');
  return rows;
}

async function getSizeIdBySize(size) {
  const { rows } = await pool.query('SELECT id FROM sizes WHERE size = $1', [
    size,
  ]);
  return rows[0].id;
}

async function getItemsBySizeId(sizeId) {
  const { rows } =
    sizeId === 1
      ? await pool.query(
          'SELECT items.id AS item_id, items.title, items.size_id, items.quantity, sizes.size FROM items LEFT JOIN sizes ON items.size_id = sizes.id ORDER BY items.id DESC'
        )
      : await pool.query(
          'SELECT items.id AS item_id, items.title, items.size_id, items.quantity, sizes.size FROM items LEFT JOIN sizes ON items.size_id = sizes.id WHERE items.size_id = $1 ORDER BY items.id DESC',
          [sizeId]
        );
  return rows;
}

async function getItemDataById(itemId) {
  const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [
    itemId,
  ]);
  return rows[0];
}

async function insertNewSize(sizeTitle) {
  const { rowCount } = await pool.query(
    'INSERT INTO sizes (size) VALUES ($1) ON CONFLICT (size) DO NOTHING RETURNING *',
    [sizeTitle]
  );
  return rowCount;
}

async function insertNewItem(title, sizeId, quantity) {
  await pool.query(
    'INSERT INTO items (title, size_id, quantity) VALUES ($1, $2, $3)',
    [title, sizeId, quantity]
  );
}

async function updateItemData(itemId, title, sizeId, quantity) {
  const { rows } = await pool.query(
    'UPDATE items SET title = $1, size_id = $2, quantity = $3 WHERE items.id = $4 RETURNING *',
    [title, sizeId, quantity, itemId]
  );
  return rows[0];
}

async function deleteItemData(itemId) {
  const { rowCount } = await pool.query(
    'DELETE FROM items WHERE items.id = $1 RETURNING *',
    [itemId]
  );
  return rowCount;
}

async function deleteSizeData(sizeId) {
  const { rowCount } = await pool.query(
    'DELETE FROM sizes WHERE sizes.id = $1 RETURNING *',
    [sizeId]
  );
  return rowCount;
}

module.exports = {
  getAllSizes,
  getSizeIdBySize,
  getItemsBySizeId,
  getItemDataById,
  insertNewSize,
  insertNewItem,
  updateItemData,
  deleteItemData,
  deleteSizeData,
};
