from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class OrderReturnBase(BaseModel):
    order_id: int
    type: str = "return"
    reason: str
    images: Optional[str] = None
    remark: Optional[str] = None


class OrderReturnCreate(OrderReturnBase):
    pass


class OrderReturnApprove(BaseModel):
    approve: bool
    approve_remark: Optional[str] = None


class OrderReturnResponse(OrderReturnBase):
    return_id: int
    user_id: int
    status: str
    approve_remark: Optional[str] = None
    create_time: datetime
    update_time: datetime

    class Config:
        from_attributes = True


class OrderReturnListResponse(BaseModel):
    items: List[OrderReturnResponse]
    total: int

    class Config:
        from_attributes = True
