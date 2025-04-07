'use client'

import { uploadPDF } from '@/actions/uploadPDF';
import { useUser } from '@clerk/clerk-react';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor
} from  '@dnd-kit/core';
import { useSchematicEntitlement } from '@schematichq/schematic-react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from "react";


function PDFDropzone() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const {user} = useUser()
    const {
        value: isFeatureEnabled,
        featureUsageExceeded,
        featureUsage,
        featureAllocation,
    } = useSchematicEntitlement("scans")

    //Set up sensors for drag detection
    const sensors = useSensors(useSensor(PointerSensor));

    const handleUpload = useCallback(async (files: FileList | File[]) => {
        if (!user) {
            alert("Please sign in to upload files");
            return
        }
// Only accept Pdf files

    const fileArray = Array.from(files);
    const pdfFiles = fileArray.filter(
        (file) =>
            file.type === "application/pdf"||
        file.name.toLocaleLowerCase().endsWith(".pdf"),
    );

    if (pdfFiles.length === 0) {
        alert("Please drop only PDF files");
        return;
    }
    setIsUploading(true);

    try {
        //Upload files
        const newUploadedFiles: string[] = [];

        for (const file of pdfFiles) {
       // Create a FormData object to use with server action
       const formData = new FormData();
       formData.append("file", file);     
        // Call server action to handle the upload
        const result = await uploadPDF(formData);
        
        if (!result.success) {
            throw new Error(result.error)
        }

        newUploadedFiles.push(file.name)

        }

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles])

        //Clear uploaded files list after 5 seconds

        setTimeout(() => {
            setUploadedFiles([]);
        },5000)

        router.push("/receipts")

    } catch (error) {
       
        alert(
            ` Upload failed: ${error instanceof Error ? error.message : "uknown error"}`,
        );
    } finally {
        setIsUploading(false)
    }
    }, 
    [user, router]
    );

    // Handle file drop via native browser events for better PDF support
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(true)
    },[]);

    // listener
    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
    }, [])


    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingOver(false)

        if (!user) {
            alert("Please sign in to upload files");
            return
        }
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files)
        }
    },[user, handleUpload])


    //const canUpload = isUserSignedIn && isFeatureEnabled

    const isUserSignedIn = !!user;
    const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <DndContext sensors={sensors}>
        <div className="w-full max-w-md mx-auto ">
        <div 
            onDragOver ={canUpload ? handleDragOver : undefined}
            onDragLeave={canUpload ? handleDragLeave : undefined}
            onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDraggingOver ? " border-blue-500 bg-blue-50" : "border-gray-300"} 
                ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
            >
        </div>

        <div className='mt-4'>
            {featureUsageExceeded && (
                <div className='flex items-center p-3 bg-red-50 border border-red-20 rounded-md
                text-red-600'>
                    <AlertCircle className='h-5 w-5 mr-5 flex-shrink-0' />
                    <span>
                        You have exceeded your linit of {featureAllocation} scans.
                        Please upgrade to continue.
                    </span>
                </div>
            )}
        </div>

            {uploadedFiles.length > 0 && (
                <div className='mt-4'> 
                <h3 className='font-medium'>Uploaded Files:</h3>
                <ul className='mt-2 text-sm text-gray-600 space-y-1'>
                    {uploadedFiles.map((fileName, i) => (
                        <li key={i} className='flex items-center'>
                            <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
                            {fileName}
                        </li>
                    ))}

                </ul>
                </div>
            )}



            </div> 
    </DndContext>
  )
}

export default PDFDropzone