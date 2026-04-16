from pydantic import BaseModel
from datetime import datetime


# ==================== 地址相关 Schema ====================

class AddressBase(BaseModel):
    name: str
    phone: str
    province: str
    city: str
    district: str
    detail: str
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(AddressBase):
    pass


class AddressResponse(AddressBase):
    address_id: int
    user_id: int
    create_time: datetime
    update_time: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str
    phone: str | None = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    phone: str | None = None  # None 表示清空手机号


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


class UserResponse(UserBase):
    user_id: int
    phone: str | None = None
    avatar: str | None = None
    create_time: datetime

    class Config:
        from_attributes = True


class AvatarUpdate(BaseModel):
    avatar: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int


class UserExistResponse(BaseModel):
    exists: bool
