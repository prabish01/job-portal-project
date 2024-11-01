import * as z from "zod";

export const loginFormValidation = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const reigsterFormValidation = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Confirm password is required"),
    name: z.string().min(1, "Name is required"),
    mobile: z.string().min(10, "Mobile is required"),
    current_address: z.string().min(1, "Current address is required"),
    permanent_address: z.string().min(1, "Permanent address is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const resetPasswordValidation = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
});

export const otpValidation = z.object({
  otp: z.string().length(5, "OTP must be 5 digits"),
});

export const resetPassword = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
