import { check } from "express-validator";

export const addPatientValidation = [
  check("firstName", "First Name is requied").not().isEmpty(),
  check("lastName", "Last Name is requied").not().isEmpty(),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("birthday", "Please include birthday").isDate().not().isEmpty(),
  check("phoneNumber", "Please include a valid phone number")
    .isLength({ min: 8, max: 8 })
    .not()
    .isEmpty(),
];

export const addPharmacyValidation = [
  check("name", "First Name is requied").not().isEmpty(),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("phoneNumber", "Please include a valid phone number")
    .isLength({ min: 8, max: 8 })
    .not()
    .isEmpty(),
];

export const loginValidation = [
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

export const forgetPassValidation = [
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
  check("code", "Please enter the right validation code that was provided to you").isLength({
    min: 6,
  }),
];
