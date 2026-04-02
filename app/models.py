from datetime import datetime

from pydantic import BaseModel


class StatusResponse(BaseModel):
    app_name: str
    version: str
    status: str
    timestamp: datetime
