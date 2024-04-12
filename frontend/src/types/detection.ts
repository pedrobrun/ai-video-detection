import { Prediction, Video } from '.'

export interface Detection {
  id: number
  confidence: number
  iou: number
  model_name: string
  status: DetectionStatus
  video_id: number
  video?: Video
  created_at: string;
  predictions: Prediction[]
}

export type DetectionStatus = 'PROCESSING' | 'FAILED' | 'SUCCESS' | 'IDLE'
