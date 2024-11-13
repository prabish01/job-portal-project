import { current } from "@reduxjs/toolkit";
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

export const profileFormValidation = z.object({
  // name: z.string().min(1, "Name is required"),
  // email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
  // location: z.string().min(1, "Location is required"),
  // phone: z.string().min(10, "Phone number must be at least 10 digits"),
  professional_summary: z.string().min(1, "Professional summary is required").optional(),
  current_address: z.string().min(1, "Current address is required").optional(),
  permanent_address: z.string().min(1, "Permanent address is required").optional(),
  image: z
    .instanceof(File) // Check if the input is an instance of File
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPEG and PNG formats are allowed.",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      // 5 MB size limit
      message: "File size should not exceed 1MB.",
    })
    .nullable()
    .optional(),
  citizenship_front_image: z
    .instanceof(File) // Check if the input is an instance of File
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPEG and PNG formats are allowed.",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      // 5 MB size limit
      message: "File size should not exceed 1MB.",
    })
    .nullable()
    .optional(),
  citizenship_back_image: z
    .instanceof(File) // Check if the input is an instance of File
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPEG and PNG formats are allowed.",
    })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      // 5 MB size limit
      message: "File size should not exceed 1MB.",
    })
    .nullable()
    .optional(),

  skills: z.string().min(1, "Skills are required").optional(),
  looking_for_job: z.boolean().optional(),
  educations: z
    .array(
      z.object({
        institution: z.string().min(1, "Institution is required"),
        board: z.string().min(1, "Board/University is required"),
        graduation_year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
        gpa: z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
      })
    )
    .optional(),
  work_experiences: z
    .array(
      z.object({
        title: z.string().min(1, "Job title is required"),
        company_name: z.string().min(1, "Company name is required"),
        joined_date: z.string().min(1, "Start date is required"),
        end_date: z.string().optional(),
        currently_working: z.boolean(),
      })
    )
    .optional(),
});

export const jobCreateValidation = z.object({
  title: z.string().min(1, "Title is required"),
  job_category_id: z.string().min(1, "Category is required"),
  job_description: z.string().min(1, "Description is required"),
  job_location: z.string().min(1, "Location is required"),
  salary: z.z.coerce
    .number({
      required_error: "Salary is required",
      invalid_type_error: "Salary must be a  number",
    })
    .int()
    .min(1, "Salary must be a positive number"),
  number_of_openings: z.coerce
    .number({
      required_error: "Number of opening is required",
      invalid_type_error: "Number of opening must be a  number",
    })
    .int()
    .min(1, "Number of opening must be a positive number"),
  education_requirement: z.string().min(1, "Education requirement is required"),
  experience: z.string().min(1, "Experience is required"),
  paid_amount: z.string().min(1, "Paid amount is required"),
  job_level: z.string().min(1, "Job level is required"),
});
