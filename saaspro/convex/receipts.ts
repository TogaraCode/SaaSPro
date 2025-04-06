import { v } from "convex/values"
import { mutation, query} from "./_generated/server"

// Function to generate a Convex upload URL for the client
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        // Generate a URL that the client can use to upload a file
        return await ctx.storage.generateUploadUrl();
    },
});

// Store a receipts file and add it to the database

export const storeReceipts = mutation({
    args: {
        userId: v.string(),
        fileId: v.id("_storage"),
        fileName: v.string(),
        size: v.number(),
        mimeType: v.string(),
    },
    handler: async (ctx, args) => {
        // Save the receipt to database
        const receiptId = await ctx.db.insert("receipts", {
            userId: args.userId,
            fileName: args.fileName,
            fileId: args.fileId,
            uploadedAt: Date.now(),
            size: args.size,
            mimeType: args.mimeType,
            status: "pending",
            // Initialize extracted data fields as null
            merchantName: undefined,
            merchantAddress: undefined,
            merchantContact: undefined,
            transactionDate: undefined,
            transactionAmount: undefined,
            currency: undefined,
            items: [],
        });

        return receiptId;
    }
});

//Function to get all receipts

export const getReceipts = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        // Only return receipts for the authenticated user
        return await ctx.db
        .query("receipts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .collect()
    }
});

// Function to get a single receipt by ID

export const getReceiptsById = query({
    args: {
        id: v.id("receipts"),
    },

    handler: async (ctx, args) => {
        // get receipt
        const receipt = await ctx.db.get(args.id)

        //Verify user has access to this receipt

        if (receipt) {
            const identify = await ctx.auth.getUserIdentity();
            if (!identity) {
                throw new Error("Not authorized to access this receipt")
            }
        }

        return receipt;
    }
});

// Generate a URL to download a reipt file 
export const getReceiptDownloadUrl = query({
    args: {
        fileId: v.id("storage"),
    },
    handler: async (ctx, args) => {
        // Get a temporary URL that can be used to download a file
        return await ctx.storage.getUrl(args.fileId)
    }
})

