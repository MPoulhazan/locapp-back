import { check } from "express-validator";

/**
 * Validator data for Post
 */
export const BasketValidator = [
  check("title").notEmpty(),
  check("decription").notEmpty(),
  check("images").isArray({ min: 1 }),
  check("seller").notEmpty().isNumeric(),
  check("price").notEmpty().isNumeric(),
  check("priceBeforeReduction").isNumeric(),
  check("creationDate").notEmpty().isNumeric(),
  check("collectStartDate").notEmpty().isNumeric(),
  check("collectEndDate").notEmpty().isNumeric(),
  check("collectCenter").notEmpty(),
  check("isOrganic").notEmpty().isBoolean(),
  check("isVeggie").notEmpty().isBoolean(),
  check("status").notEmpty(),
];

