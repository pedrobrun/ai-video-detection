'use client'

import { useState } from "react";
import { Detections } from "./Detections";
import { ProcessVideoForm } from "./ProcessVideoForm";
import { VideoUploader } from "./VideoUploader";
import { cn } from "@/lib/utils";

const displays = {
  'UPLOAD': { component: <VideoUploader />, title: "VIDEO UPLOAD" },
  'PROCESS-FORM': { component: <ProcessVideoForm />, title: "PROCESS VIDEO" },
  'DETECTIONS': { component: <Detections />, title: "DETECTIONS" }
}

export function DisplaySelector() {
  const [selectedDisplay, setSelectedDisplay] = useState<'UPLOAD' | 'PROCESS-FORM' | 'DETECTIONS'>('UPLOAD')
  return (
    <div className="flex flex-col w-full items-center gap-10">
      <div className="flex items-center gap-6">
        <div onClick={() => setSelectedDisplay("UPLOAD")} className={cn(selectedDisplay === 'UPLOAD' ? 'underline underline-offset-4 ' : '', "font-bold cursor-pointer")}>VIDEO UPLOAD</div>
        <div onClick={() => setSelectedDisplay("PROCESS-FORM")} className={cn(selectedDisplay === 'PROCESS-FORM' ? 'underline underline-offset-4' : '', "font-bold cursor-pointer")}>PROCESS VIDEO</div>
        <div onClick={() => setSelectedDisplay("DETECTIONS")} className={cn(selectedDisplay === 'DETECTIONS' ? 'underline underline-offset-4' : '', "font-bold cursor-pointer")}>DETECTIONS</div>
      </div>

      {displays[selectedDisplay].component}
    </div>
  )
}