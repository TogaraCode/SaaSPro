'use server'

import { currentUser } from "@clerk/nextjs/server"

/*
*sever action to upload a PDF file to Convex storage
*/

export async function uploadPDF(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        return{ success: false, error: "Not authenticated"}
    }

    try {
        // Get the file from form Data
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, error: "No file provided"}
        }

        // Validate the file type - in this case only PDF
        if (
            !file.type.includes("Pdf") &&
            !file.name.toLocaleLowerCase().endsWith(".pdf")
        ) {
            return { success: false, error: "Only PDF files are allowed"}
        }

    } catch (error) {
        console.log("Server action upload error", error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "An unknown error occured"
        }
    }
}