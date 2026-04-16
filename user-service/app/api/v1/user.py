from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
from uuid import uuid4
from pathlib import Path

from app.database import get_db
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserUpdate,
    PasswordUpdate,
    AvatarUpdate,
    UserResponse,
    Token,
    UserExistResponse,
    AddressCreate,
    AddressUpdate,
    AddressResponse,
)
from app.services.user_service import UserService
from app.core.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    return UserService.register(db, user_data)


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """用户登录"""
    return UserService.login(db, user_data)


@router.get("/info", response_model=UserResponse)
def get_user_info(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取当前用户信息"""
    user = UserService.get_user_by_id(db, current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return UserResponse.model_validate(user)


@router.put("/update", response_model=UserResponse)
def update_user_info(
    user_data: UserUpdate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新用户信息"""
    user = UserService.update_user(db, current_user_id, user_data)
    return UserResponse.model_validate(user)


@router.get("/exist", response_model=UserExistResponse)
def check_user_exist(user_id: int, db: Session = Depends(get_db)):
    """检查用户是否存在（内部接口，供 shop-service 调用）"""
    exists = UserService.check_user_exists(db, user_id)
    return UserExistResponse(exists=exists)


@router.get("/detail", response_model=UserResponse)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
):
    """获取用户详情（内部接口，供 shop-service 调用）"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return UserResponse.model_validate(user)


@router.put("/password")
def update_password(
    password_data: PasswordUpdate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新用户密码"""
    UserService.update_password(db, current_user_id, password_data)
    return {"message": "密码修改成功"}


# 确保上传目录存在
UPLOAD_DIR = Path("uploads") / "avatars"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/avatar/upload")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user_id: int = Depends(get_current_user),
):
    """上传用户头像"""
    # 检查文件类型
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只允许上传图片文件"
        )

    # 检查文件大小 (限制5MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="图片大小不能超过5MB"
        )

    # 生成文件名
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / filename

    # 保存文件
    with open(file_path, "wb") as f:
        f.write(content)

    # 返回文件URL
    avatar_url = f"/uploads/avatars/{filename}"
    return {"avatar_url": avatar_url, "message": "头像上传成功"}


@router.put("/avatar", response_model=UserResponse)
def update_avatar(
    avatar_data: AvatarUpdate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新用户头像"""
    user = UserService.update_avatar(db, current_user_id, avatar_data)
    return UserResponse.model_validate(user)


# ==================== 地址相关接口 ====================

@router.get("/address", response_model=list[AddressResponse])
def get_address_list(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取用户地址列表"""
    return UserService.get_address_list(db, current_user_id)


@router.get("/address/{address_id}", response_model=AddressResponse)
def get_address(
    address_id: int,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取单个地址"""
    address = UserService.get_address_by_id(db, address_id, current_user_id)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="地址不存在"
        )
    return AddressResponse.model_validate(address)


@router.get("/address/detail/internal", response_model=AddressResponse)
def get_address_detail_internal(
    address_id: int,
    user_id: int,
    db: Session = Depends(get_db),
):
    """获取地址详情（内部接口，供 shop-service 调用）"""
    address = UserService.get_address_by_id(db, address_id, user_id)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="地址不存在"
        )
    return AddressResponse.model_validate(address)


@router.post("/address", response_model=AddressResponse)
def create_address(
    address_data: AddressCreate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """创建地址"""
    return UserService.create_address(db, current_user_id, address_data)


@router.put("/address/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: int,
    address_data: AddressUpdate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新地址"""
    return UserService.update_address(db, address_id, current_user_id, address_data)


@router.delete("/address/{address_id}")
def delete_address(
    address_id: int,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除地址"""
    UserService.delete_address(db, address_id, current_user_id)
    return {"message": "删除成功"}


@router.put("/address/{address_id}/default", response_model=AddressResponse)
def set_default_address(
    address_id: int,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """设置默认地址"""
    return UserService.set_default_address(db, address_id, current_user_id)
