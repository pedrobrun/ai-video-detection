from dataclasses import dataclass
from .bbox import BBOX

@dataclass
class Prediction:
    class_name: int
    confidence: float
    box: BBOX
    
    def to_dict(self):
        return {
            "class_name": str(self.class_name),
            "confidence": float(self.confidence),
            "box": {
                "left": int(self.box.left),
                "top": int(self.box.top),
                "width": int(self.box.width),
                "height": int(self.box.height)
            }
        }
