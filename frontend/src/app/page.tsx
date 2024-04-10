import { Detections } from "@/components/Detections";
import { DisplaySelector } from "@/components/DisplaySelector";
import { ProcessVideoForm } from "@/components/ProcessVideoForm";
import { VideoList } from "@/components/VideoList";
import { VideoUploader } from "@/components/VideoUploader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <DisplaySelector />
    </main>
  );
}
