from typing import List
import onnxruntime as ort
from PIL import Image
import cv2
import numpy as np

from models.prediction import Prediction

class OnnxService:
    def __init__(self, model_name: str):
        self.model_name = model_name
        providers = ort.get_available_providers()
        print(f"Available providers: {providers}")
        self.model = ort.InferenceSession(f"onnx/{model_name}.onnx", providers=providers)
        self.input_name = self.model.get_inputs()[0].name
        self.output_name = self.model.get_outputs()[0].name
        self.input_width = self.model.get_inputs()[0].shape[2]
        self.input_height = self.model.get_inputs()[0].shape[3]
        self.idx2class = eval(self.model.get_modelmeta().custom_metadata_map['names'])
    
    def preprocess(
        self, 
        img: Image.Image
    ) -> np.ndarray:
        img = img.resize((self.input_width, self.input_height))
        img = np.array(img).transpose(2, 0, 1)
        img = np.expand_dims(img, axis=0)
        img = img / 255.0
        img = img.astype(np.float32)
        return img
    
    def postprocess(
        self, 
        output: np.ndarray, 
        confidence_thresh: float, 
        iou_thresh: float,
        img_width: int,
        img_height: int
    ) -> List[Prediction]:
        
        outputs = np.transpose(np.squeeze(output[0]))
        rows = outputs.shape[0]
        boxes = []
        scores = []
        class_ids = []
        x_factor = img_width / self.input_width
        y_factor = img_height / self.input_height
        for i in range(rows):
            classes_scores = outputs[i][4:]
            max_score = np.amax(classes_scores)
            if max_score >= confidence_thresh:
                class_id = np.argmax(classes_scores)
                x, y, w, h = outputs[i][0], outputs[i][1], outputs[i][2], outputs[i][3]
                left = int((x - w / 2) * x_factor)
                top = int((y - h / 2) * y_factor)
                width = int(w * x_factor)
                height = int(h * y_factor)
                class_ids.append(class_id)
                scores.append(max_score)
                boxes.append([left, top, width, height])
        indices = cv2.dnn.NMSBoxes(boxes, scores, confidence_thresh, iou_thresh)
        predictions_data = []
        if len(indices) > 0:
            for i in indices.flatten():
                left, top, width, height = boxes[i]
                class_id = class_ids[i]
                score = scores[i]

                bbox_data = {
                    "left": left,
                    "top": top,
                    "width": width,
                    "height": height
                }

                prediction_data = {
                    "class_name": self.idx2class[class_id],
                    "confidence": score,
                    "box": bbox_data
                }

                predictions_data.append(prediction_data)

        return predictions_data

    def __call__(
        self, 
        img: Image.Image,
        confidence_thresh: float, 
        iou_thresh: float
    ) -> List[Prediction]:
        img_input = self.preprocess(img)
        outputs = self.model.run(None, {self.input_name: img_input})
        predictions = self.postprocess(outputs, confidence_thresh, iou_thresh, img.width, img.height)
        return predictions