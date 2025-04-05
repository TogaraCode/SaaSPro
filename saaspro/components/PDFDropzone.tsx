'use client'

import { useUser } from '@clerk/clerk-react';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor
} from  '@dnd-kit/core';
import { useSchematicEntitlement } from '@schematichq/schematic-react';
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
        
    }, [user, router]);

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

    const canUpload = true;

  return (
    <DndContext sensors={sensors}>
        <div className="w-full max-w-md mx-auto bg-red-400">
        <div 
            onDragOver ={canUpload ? handleDragOver : undefined}
            onDragLeave={canUpload ? handleDragLeave : undefined}
            onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDraggingOver ? " border-blue-500 bg-blue-50" : "border-gray-300"} 
                ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
            >
        </div>
        
        </div> </DndContext>
  )
}

export default PDFDropzone