import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { object } from "@schematichq/schematic-typescript-node/core/schemas";
import z from "zod"

const saveToDatabaseTool = createTool({
    name: "save-to-database",
    description: "Saves the given data to the convex database.",
    parameters: z.object({
        fileDisplayName: z 
        .string()
        .describe(
            "The readable display name of the receipt to show in the UI. If the file name is not human readable, use this to give a more readable name ",
        ),
        receiptId: z.string().describe("The ID of the receipt to update"),
        merchantName: z.string(),
        merchantAddress: z.string(),
        merchantContact: z.string(),
        transactionDate: z.string(),
        transactionAmount: z
        .string()
        .describe(
            "The total amount of the transaction, summing all the items on the receipt.",
        ),
        receiptSummary: z
        .string()
        .describe(
            "A summary of the receipt, including the merchant name, address, contact, transaction date, transaction amount and Currency. Include a human readable summary of the Receipt. Menstion both invoice number and receipt number if both are Present. Include some key details about the items on the Receipt, this is a special featured summary so "
        ),

    })
})


export const databaseAgent = createAgent({
    name: "Database Agent",
    description:
    "responsible for taking key information regarding receipts and saving it to the convex database.",
    system:
    "You are a helpful assistant that takes key information regarding receipts and saves it to the convex database.",
    model: openai({"gpt-4o-mini",
    defaultParameters: {
        max_completion_tokens: 1000,
    },
}),
    tools: [saveToDatabaseTool]
})