import enum

class DetectionStatus(enum.Enum):
    PROCESSING = 'processing'
    SUCCESS = 'success'
    FAILED = 'failed'
    IDLE = 'idle'