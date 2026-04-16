from pydantic import BaseModel
from datetime import datetime


class AdminBase(BaseModel):
    username: str


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminResponse(AdminBase):
    admin_id: int
    create_time: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse
