import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(64, "Name must be 64 characters or fewer"),
  email: z.email("Enter a valid email address").max(255),
  photoUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.url().safeParse(value).success,
      "Enter a valid photo URL",
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be 72 characters or fewer")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter"),
});

export type FieldErrors = Record<string, string>;

function collectErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

export function validateLogin(values: {
  email: string;
  password: string;
}): { data?: z.infer<typeof loginSchema>; errors: FieldErrors } {
  const result = loginSchema.safeParse(values);

  return result.success
    ? { data: result.data, errors: {} }
    : { errors: collectErrors(result.error) };
}

export function validateRegister(values: {
  name: string;
  email: string;
  photoUrl: string;
  password: string;
}): { data?: z.infer<typeof registerSchema>; errors: FieldErrors } {
  const result = registerSchema.safeParse(values);

  return result.success
    ? { data: result.data, errors: {} }
    : { errors: collectErrors(result.error) };
}
