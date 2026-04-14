from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserUpdate, Token
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
)
from app.config import settings


class UserService:
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User | None:
        """根据 ID 获取用户"""
        return db.query(User).filter(User.user_id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> User | None:
        """根据用户名获取用户"""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def check_user_exists(db: Session, user_id: int) -> bool:
        """检查用户是否存在"""
        user = db.query(User).filter(User.user_id == user_id).first()
        return user is not None

    @staticmethod
    def register(db: Session, user_data: UserCreate) -> Token:
        """用户注册"""
        # 检查用户名是否已存在
        existing_user = UserService.get_user_by_username(db, user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )

        # 创建新用户
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            password=hashed_password,
            phone=user_data.phone,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # 生成 Token
        access_token = create_access_token(
            data={"sub": str(db_user.user_id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return Token(access_token=access_token, user_id=db_user.user_id)

    @staticmethod
    def login(db: Session, user_data: UserLogin) -> Token:
        """用户登录"""
        user = UserService.get_user_by_username(db, user_data.username)
        if not user or not verify_password(user_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误"
            )

        # 生成 Token
        access_token = create_access_token(
            data={"sub": str(user.user_id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return Token(access_token=access_token, user_id=user.user_id)

    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> User:
        """更新用户信息"""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        if user_data.phone is not None:
            user.phone = user_data.phone

        db.commit()
        db.refresh(user)
        return user
