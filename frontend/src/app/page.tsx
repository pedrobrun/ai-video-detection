import { ProcessVideoForm } from "@/components/ProcessVideoForm";
import { VideoList } from "@/components/VideoList";
import { VideoUploader } from "@/components/VideoUploader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col w-full items-center gap-10">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold">VIDEO UPLOAD</p>
          <VideoUploader />
        </div>

        <hr className="w-[250px]"></hr>

        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-bold">PROCESS VIDEO</div>
          <ProcessVideoForm />
        </div>
      </div>
    </main>
  );
}
