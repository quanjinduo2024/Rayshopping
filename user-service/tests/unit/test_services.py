
"""
用户服务单元测试
测试左移 - 先写测试用例，再实现具体功能
"""
import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserUpdate
from app.services.user_service import UserService


class TestUserService:
    """用户服务测试类"""

    def test_get_user_by_id_success(self, db_session: Session):
        """测试根据 ID 获取用户 - 成功"""
        # 准备测试数据
        test_user = User(
            username="testuser",
            password="hash_testpass",
            phone="13800138000"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 执行
        user = UserService.get_user_by_id(db_session, test_user.user_id)

        # 验证
        assert user is not None
        assert user.user_id == test_user.user_id
        assert user.username == "testuser"

    def test_get_user_by_id_not_found(self, db_session: Session):
        """测试根据 ID 获取用户 - 不存在"""
        user = UserService.get_user_by_id(db_session, 99999)
        assert user is None

    def test_get_user_by_username_success(self, db_session: Session):
        """测试根据用户名获取用户 - 成功"""
        # 准备测试数据
        test_user = User(
            username="testuser2",
            password="hash_testpass"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 执行
        user = UserService.get_user_by_username(db_session, "testuser2")

        # 验证
        assert user is not None
        assert user.username == "testuser2"

    def test_get_user_by_username_not_found(self, db_session: Session):
        """测试根据用户名获取用户 - 不存在"""
        user = UserService.get_user_by_username(db_session, "nonexistent")
        assert user is None

    def test_check_user_exists_true(self, db_session: Session):
        """测试检查用户是否存在 - 存在"""
        # 准备测试数据
        test_user = User(
            username="existsuser",
            password="hash_testpass"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 执行
        exists = UserService.check_user_exists(db_session, test_user.user_id)

        # 验证
        assert exists is True

    def test_check_user_exists_false(self, db_session: Session):
        """测试检查用户是否存在 - 不存在"""
        exists = UserService.check_user_exists(db_session, 99999)
        assert exists is False

    @patch('app.services.user_service.create_access_token')
    def test_register_success(
        self, mock_create_token, db_session: Session
    ):
        """测试用户注册 - 成功"""
        # Setup mocks
        mock_create_token.return_value = "test_token"

        # 准备
        user_data = UserCreate(
            username="newuser",
            password="newpass123",
            phone="13900139000"
        )

        # 执行
        result = UserService.register(db_session, user_data)

        # 验证
        assert result.access_token is not None
        assert result.user_id is not None
        assert result.token_type == "bearer"

        # 验证数据库中的用户
        db_user = UserService.get_user_by_username(db_session, "newuser")
        assert db_user is not None
        assert db_user.phone == "13900139000"

    def test_register_username_duplicate(self, db_session: Session):
        """测试用户注册 - 用户名重复"""
        # 先创建一个用户
        existing_user = User(
            username="duplicateuser",
            password="hash_testpass"
        )
        db_session.add(existing_user)
        db_session.commit()
        db_session.refresh(existing_user)

        # 尝试用相同用户名注册
        user_data = UserCreate(
            username="duplicateuser",
            password="anotherpass123"
        )

        # 验证抛出异常
        with pytest.raises(HTTPException) as exc_info:
            UserService.register(db_session, user_data)

        assert exc_info.value.status_code == 400
        assert "用户名已存在" in str(exc_info.value.detail)

    @patch('app.services.user_service.create_access_token')
    def test_login_success(
        self, mock_create_token, db_session: Session
    ):
        """测试用户登录 - 成功"""
        # Setup mocks
        mock_create_token.return_value = "test_token"

        # 创建测试用户
        test_user = User(
            username="loginuser",
            password="hash_loginpass123"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 执行登录
        login_data = UserLogin(username="loginuser", password="loginpass123")
        result = UserService.login(db_session, login_data)

        # 验证
        assert result.access_token is not None
        assert result.user_id == test_user.user_id

    def test_login_wrong_password(self, db_session: Session):
        """测试用户登录 - 密码错误"""
        # 创建测试用户
        test_user = User(
            username="wrongpassuser",
            password="hash_correctpass"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 尝试用错误密码登录
        login_data = UserLogin(username="wrongpassuser", password="wrongpass")

        # 验证抛出异常
        with pytest.raises(HTTPException) as exc_info:
            UserService.login(db_session, login_data)

        assert exc_info.value.status_code == 401
        assert "用户名或密码错误" in str(exc_info.value.detail)

    def test_login_user_not_found(self, db_session: Session):
        """测试用户登录 - 用户不存在"""
        login_data = UserLogin(username="nonexistent", password="anypass123")

        with pytest.raises(HTTPException) as exc_info:
            UserService.login(db_session, login_data)

        assert exc_info.value.status_code == 401

    def test_update_user_success(self, db_session: Session):
        """测试更新用户信息 - 成功"""
        # 创建测试用户
        test_user = User(
            username="updateuser",
            password="hash_testpass",
            phone="13800000000"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 执行更新
        update_data = UserUpdate(phone="13911111111")
        updated_user = UserService.update_user(db_session, test_user.user_id, update_data)

        # 验证
        assert updated_user.phone == "13911111111"

        # 验证数据库
        db_user = UserService.get_user_by_id(db_session, test_user.user_id)
        assert db_user.phone == "13911111111"

    def test_update_user_clear_phone(self, db_session: Session):
        """测试更新用户信息 - 清空手机号"""
        # 创建测试用户
        test_user = User(
            username="clearphoneuser",
            password="hash_testpass",
            phone="13800000000"
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)

        # 执行更新（清空手机号）
        update_data = UserUpdate(phone=None)
        updated_user = UserService.update_user(db_session, test_user.user_id, update_data)

        # 验证
        assert updated_user.phone is None

    def test_update_user_not_found(self, db_session: Session):
        """测试更新用户信息 - 用户不存在"""
        update_data = UserUpdate(phone="13900000000")

        with pytest.raises(HTTPException) as exc_info:
            UserService.update_user(db_session, 99999, update_data)

        assert exc_info.value.status_code == 404
        assert "用户不存在" in str(exc_info.value.detail)
