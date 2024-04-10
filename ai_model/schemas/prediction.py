from dataclasses import dataclass, field
from typing import List
from .bbox import BBOX

@dataclass
class Prediction:
    class_name: str
    confidence: float
    detection_id: int
    boxes: List[BBOX] = field(default_factory=list)

    def to_dict(self):
        return {
            "class_name": self.class_name,
            "confidence": self.confidence,
            "boxes": [box.to_dict() for box in self.boxes]
        }