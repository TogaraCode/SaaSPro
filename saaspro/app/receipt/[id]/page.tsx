"use client"
import {api} from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ChevronLeft, Link } from "lucide-react";
import { useParams, useRouter} from "next/navigation"
import { useEffect, useState } from "react";

function Receipt() {
    const params = useParams<{ id: string }>();
    const [receiptId,setReceiptId] = useState<Id<"receipts"> | null>(null)
    const router = useRouter();

    // Fetch receipt details
    const receipt = useQuery(
      api.receipts.getReceiptsById,
      receiptId ? {id
        : receiptId
      } : "skip",
    );

    //Get file download URL (for the view button)
    const fileId = receipt?.fileId;
    const downloadUrl = useQuery(
      api.receipts.getReceiptDownloadUrl,
      fileId ? { fileId } : "skip",
    )

  // Convert the URL string ID to Convex ID
  useEffect(() => {
    try {
      const id =params.id as Id<"receipts">
      setReceiptId(id); 
    } catch (error) {
      console.error("Invalid receipt ID", error);
      router.push("/");
    }
  }, [params.id, router])

  if (receipt === undefined) {
    return (
      <div className="constainer mx-auto py-10-px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600">
      
           </div> 
          </div>
        </div>
     
    );
  }

    if (receipt === null) {
      return (
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-2xl font-bold mb-4">
            <h1>Receipt Not Found</h1>
            <p>
                  the receipt you&apos; re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
            href="/" className="px6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                return Home
            </Link>
          </div>
        </div>
      )
    }

    //Format upload date
    const uploadDate = new Date(receipt.uploadedAt).toLocaleString()
    //Check if receipt has extracted data

    const hasExtractedData = !!(
      receipt.merchantName || 
      receipt.merchantAddress ||
      receipt.transactionDate ||
      receipt.transactionAmount
    )

 

  return(
    <div className="container mx-auto py-10 px-4">
      <div className ="max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link
          href="/receipts"
          className="text-blue-500 hover:underline flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Receipts
          </Link>
        </nav>


      </div>
    </div>
  )
}

export default Receipt
