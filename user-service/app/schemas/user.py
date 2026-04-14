from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str
    phone: str | None = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    phone: str | None = None


class UserResponse(UserBase):
    user_id: int
    phone: str | None = None
    create_time: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int


class UserExistResponse(BaseModel):
    exists: bool
