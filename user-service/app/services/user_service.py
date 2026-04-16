from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.models.address import Address
from app.schemas.user import (
    UserCreate, UserLogin, UserUpdate, PasswordUpdate, AvatarUpdate, Token,
    AddressCreate, AddressUpdate
)
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
    def get_user_list_paginated(db: Session, page: int = 1, size: int = 20) -> tuple[list[User], int]:
        """获取用户列表（分页）"""
        query = db.query(User).order_by(User.create_time.desc())
        total = query.count()
        offset = (page - 1) * size
        items = query.offset(offset).limit(size).all()
        return items, total

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

        # 检查 phone 字段是否被显式设置（包括设置为 None）
        if "phone" in user_data.model_fields_set:
            user.phone = user_data.phone

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_password(db: Session, user_id: int, password_data: PasswordUpdate) -> None:
        """更新用户密码"""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        # 验证当前密码
        if not verify_password(password_data.current_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="当前密码错误"
            )

        # 验证新密码长度
        if len(password_data.new_password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="新密码长度不能少于6位"
            )

        # 更新密码
        user.password = get_password_hash(password_data.new_password)
        db.commit()

    @staticmethod
    def update_avatar(db: Session, user_id: int, avatar_data: AvatarUpdate) -> User:
        """更新用户头像"""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        user.avatar = avatar_data.avatar
        db.commit()
        db.refresh(user)
        return user

    # ==================== 地址相关服务 ====================

    @staticmethod
    def get_address_list(db: Session, user_id: int) -> list[Address]:
        """获取用户地址列表"""
        return db.query(Address).filter(Address.user_id == user_id).order_by(
            Address.is_default.desc(),
            Address.create_time.desc()
        ).all()

    @staticmethod
    def get_address_by_id(db: Session, address_id: int, user_id: int) -> Address | None:
        """根据ID获取地址"""
        return db.query(Address).filter(
            Address.address_id == address_id,
            Address.user_id == user_id
        ).first()

    @staticmethod
    def create_address(db: Session, user_id: int, address_data: AddressCreate) -> Address:
        """创建地址"""
        # 如果设为默认，先取消其他地址的默认状态
        if address_data.is_default:
            db.query(Address).filter(Address.user_id == user_id).update(
                {"is_default": False}
            )

        db_address = Address(
            user_id=user_id,
            **address_data.model_dump()
        )
        db.add(db_address)
        db.commit()
        db.refresh(db_address)
        return db_address

    @staticmethod
    def update_address(db: Session, address_id: int, user_id: int, address_data: AddressUpdate) -> Address:
        """更新地址"""
        address = UserService.get_address_by_id(db, address_id, user_id)
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="地址不存在"
            )

        # 如果设为默认，先取消其他地址的默认状态
        if address_data.is_default:
            db.query(Address).filter(
                Address.user_id == user_id,
                Address.address_id != address_id
            ).update({"is_default": False})

        # 更新字段
        for key, value in address_data.model_dump().items():
            setattr(address, key, value)

        db.commit()
        db.refresh(address)
        return address

    @staticmethod
    def delete_address(db: Session, address_id: int, user_id: int) -> None:
        """删除地址"""
        address = UserService.get_address_by_id(db, address_id, user_id)
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="地址不存在"
            )
        db.delete(address)
        db.commit()

    @staticmethod
    def set_default_address(db: Session, address_id: int, user_id: int) -> Address:
        """设置默认地址"""
        address = UserService.get_address_by_id(db, address_id, user_id)
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="地址不存在"
            )

        # 取消其他地址的默认状态
        db.query(Address).filter(
            Address.user_id == user_id,
            Address.address_id != address_id
        ).update({"is_default": False})

        address.is_default = True
        db.commit()
        db.refresh(address)
        return address
