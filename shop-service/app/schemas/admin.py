from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


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


class StatsOverview(BaseModel):
    """统计概览数据"""
    total_orders: int
    total_users: int
    total_goods: int
    total_sales: Decimal
    pending_payment_count: int
    pending_shipment_count: int
    pending_receipt_count: int
    completed_count: int

