const { body } = require('express-validator');

const sizeLengthErr = 'must be between 1 and 15 characters';
const titleLengthErr = `must be between 1 and 30 characters`;

const validateSize = [
  body('size')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 })
    .withMessage(`Size name ${sizeLengthErr}`),
];

const validateItem = [
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Title ${titleLengthErr}`),
  body('sizeId').notEmpty().withMessage('Select a size'),
  body('quantity')
    .isInt({ min: 0, allow_leading_zeroes: false })
    .withMessage('Quantity can not include decimals'),
];

module.exports = {
  validateSize,
  validateItem,
};
