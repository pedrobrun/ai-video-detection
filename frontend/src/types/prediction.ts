export interface Prediction {
  id: string
  class_name: string
  confidence: number
  box_left: number
  box_top: number
  box_width: number
  box_height: number
  created_at: string
  frame_number: number
  timestamp: number
}
