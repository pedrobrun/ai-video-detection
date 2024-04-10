import { Video } from "."

export interface Detection {
  id: number
  confidence: number
  iou: number
  model_name: string
  status: string
  video_id: number
  video?: Video
}
