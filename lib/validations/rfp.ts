import { z } from "zod";

export const rfpFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters"),

    description: z
        .string()
        .min(1, "Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must be less than 2000 characters"),

    company: z
        .string()
        .min(1, "Company name is required"),

    location: z
        .string()
        .optional(),

    requirements: z
        .string()
        .min(1, "Requirements are required")
        .min(20, "Requirements must be at least 20 characters")
        .max(5000, "Requirements must be less than 5000 characters"),

    budget_range: z
        .string()
        .min(1, "Budget range is required"),

    deadline: z
        .string()
        .min(1, "Deadline is required")
        .refine((date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate > today;
        }, "Deadline must be in the future"),

    category: z
        .string()
        .min(1, "Category is required"),

    priority: z
        .enum(["low", "medium", "high", "urgent"])
        .default("medium"),

    status: z
        .enum(["draft", "published", "closed", "awarded"])
        .default("draft"),

    contact_email: z
        .string()
        .email("Invalid email format")
        .optional(),

    contact_phone: z
        .string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
        .optional(),

    additional_information: z
        .string()
        .optional(),

    attachments: z
        .array(z.string())
        .optional(),

    tags: z
        .array(z.string())
        .max(10, "Maximum 10 tags allowed")
        .optional(),
});

export type RfpFormData = z.infer<typeof rfpFormSchema>;

export const rfpUpdateSchema = rfpFormSchema.partial();

export const rfpFilterSchema = z.object({
    status: z.enum(["draft", "published", "closed", "awarded"]).optional(),
    category: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    search: z.string().optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional(),
});

export type RfpFilterData = z.infer<typeof rfpFilterSchema>; 