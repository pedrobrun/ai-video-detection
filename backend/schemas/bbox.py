from dataclasses import dataclass

@dataclass
class BBOX:
    left: int
    top: int
    width: int
    height: int

    def to_dict(self):
        return {
            "left": self.left,
            "top": self.top,
            "width": self.width,
            "height": self.height
        }