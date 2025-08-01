import { z } from "zod";
const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|protonmail\.com)$/;




export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),

  email: z.string().regex(emailRegex, "Only common email providers are allowed (Gmail, Yahoo, etc.)"),
    

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, "Only common email providers are allowed (Gmail, Yahoo, etc.)"),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});