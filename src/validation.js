import { check } from "express-validator";

export const signupValidation = [
  check("firstName", "First Name is requied").not().isEmpty(),
  check("lastName", "Last Name is requied").not().isEmpty(),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

export const loginValidation = [
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

export const ROLES = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PHARMACY: "pharmacy",
};
