import { ProcessVideoForm } from "@/components/ProcessVideoForm";
import { VideoUploader } from "@/components/VideoUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col w-full items-center gap-10">
        <div className="flex flex-col items-center gap-2">
          Upload a video here
          <VideoUploader />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div>Process video</div>
          <ProcessVideoForm />
        </div>
      </div>
    </main>
  );
}
