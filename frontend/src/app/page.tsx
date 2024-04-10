import { DisplaySelector } from "@/components/DisplaySelector";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ToastContainer />
      <DisplaySelector />
    </main>
  );
}
