from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    Token,
    UserExistResponse,
)
from app.services.user_service import UserService
from app.core.deps import get_current_user

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
    return UserService.update_user(db, current_user_id, user_data)


@router.get("/exist", response_model=UserExistResponse)
def check_user_exist(user_id: int, db: Session = Depends(get_db)):
    """检查用户是否存在（内部接口，供 shop-service 调用）"""
    exists = UserService.check_user_exists(db, user_id)
    return UserExistResponse(exists=exists)
