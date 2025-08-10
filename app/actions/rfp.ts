"use server";

import { revalidatePath } from "next/cache";
import { rfpFormSchema } from "@/lib/validations/rfp";

type RfpFormState = {
    message: string;
    errors: Record<string, string[] | undefined> | undefined;
}

export async function createRfp(
    prevState: RfpFormState,
    formData: FormData
): Promise<RfpFormState> {
    const data = Object.fromEntries(formData.entries());

    const validatedData = rfpFormSchema.safeParse(data);

    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    // TODO: Save to database

    revalidatePath("/rfps/my");

    return {
        message: "RFP created successfully",
        errors: undefined,
    };
}
