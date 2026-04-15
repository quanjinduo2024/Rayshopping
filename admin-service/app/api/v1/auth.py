from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.admin import AdminLogin, Token
from app.services.admin_service import AdminService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    """管理员登录"""
    return AdminService.login(db, login_data)
