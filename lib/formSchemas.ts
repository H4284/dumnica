import { z } from "zod";

type FieldMessages = {
  nameRequired: string;
  phoneRequired: string;
  emailInvalid: string;
  messageShort: string;
};

export function contactSchema(t: FieldMessages) {
  return z.object({
    name: z.string().trim().min(2, t.nameRequired),
    phone: z.string().trim().min(8, t.phoneRequired),
    email: z
      .string()
      .trim()
      .email(t.emailInvalid)
      .optional()
      .or(z.literal("")),
    project: z.string().trim().optional().or(z.literal("")),
    message: z.string().trim().min(5, t.messageShort),
    website: z.string().optional().or(z.literal("")),
    turnstileToken: z.string().optional().or(z.literal("")),
  });
}

export function leadSchema(t: FieldMessages & { missingCode: string }) {
  return z.object({
    unitCode: z.string().trim().min(1, t.missingCode),
    name: z.string().trim().min(2, t.nameRequired),
    phone: z.string().trim().min(8, t.phoneRequired),
    email: z
      .string()
      .trim()
      .email(t.emailInvalid)
      .optional()
      .or(z.literal("")),
    message: z.string().trim().min(5, t.messageShort),
    website: z.string().optional().or(z.literal("")),
    turnstileToken: z.string().optional().or(z.literal("")),
  });
}

export function formatZodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors;
}
