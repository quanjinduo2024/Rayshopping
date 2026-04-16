from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta

from app.models.admin import Admin
from app.schemas.admin import AdminLogin, AdminResponse, Token
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
)
from app.config import settings


class AdminService:
    @staticmethod
    def login(db: Session, login_data: AdminLogin) -> Token:
        """管理员登录"""
        admin = db.query(Admin).filter(Admin.username == login_data.username).first()

        if not admin or not verify_password(login_data.password, admin.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误"
            )

        # 创建 Token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(admin.admin_id)},
            expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            admin=AdminResponse.model_validate(admin)
        )

    @staticmethod
    def create_admin(db: Session, username: str, password: str) -> AdminResponse:
        """创建管理员（仅用于初始化）"""
        existing = db.query(Admin).filter(Admin.username == username).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="管理员已存在"
            )

        admin = Admin(
            username=username,
            password=get_password_hash(password)
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        return AdminResponse.model_validate(admin)
