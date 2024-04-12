import { DetectionStatus } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: DetectionStatus, type: "bg" | 'text') {
  const statusColors: { [key in DetectionStatus]: string } = {
    PROCESSING: 'yellow-500',
    IDLE: 'blue-500',
    FAILED: 'red-500',
    SUCCESS: 'green-500'
  };
  return type === 'bg' ?  `bg-${statusColors[status]}` : `text-${statusColors[status]}`;
}