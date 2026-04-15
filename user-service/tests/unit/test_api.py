
"""
用户 API 单元测试
测试左移 - 先写测试用例，再实现具体功能
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import create_access_token


class TestUserAPI:
    """用户 API 测试类"""

    def test_health_check(self, client: TestClient):
        """测试健康检查接口"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["service"] == "user-service"

    def test_register_success(self, client: TestClient):
        """测试用户注册 - 成功"""
        response = client.post(
            "/api/v1/user/register",
            json={
                "username": "apitestuser",
                "password": "testpass123",
                "phone": "13800138000"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user_id" in data
        assert data["token_type"] == "bearer"

    def test_register_username_duplicate(self, client: TestClient, db_session: Session):
        """测试用户注册 - 用户名重复"""
        # 先创建用户
        user = User(
            username="dupapiuser",
            password="hash_testpass123"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        # 尝试重复注册
        response = client.post(
            "/api/v1/user/register",
            json={
                "username": "dupapiuser",
                "password": "anotherpass123"
            }
        )
        assert response.status_code == 400
        assert "用户名已存在" in response.json()["detail"]

    def test_register_missing_fields(self, client: TestClient):
        """测试用户注册 - 缺少必填字段"""
        response = client.post(
            "/api/v1/user/register",
            json={
                "password": "testpass123"
            }
        )
        assert response.status_code == 422

    def test_login_success(self, client: TestClient, db_session: Session):
        """测试用户登录 - 成功"""
        # 创建测试用户
        user = User(
            username="loginapiuser",
            password="hash_loginpass123"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        # 执行登录
        response = client.post(
            "/api/v1/user/login",
            json={
                "username": "loginapiuser",
                "password": "loginpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user_id"] == user.user_id

    def test_login_wrong_password(self, client: TestClient, db_session: Session):
        """测试用户登录 - 密码错误"""
        user = User(
            username="wrongpassapi",
            password="hash_correctpass"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        response = client.post(
            "/api/v1/user/login",
            json={
                "username": "wrongpassapi",
                "password": "wrongpass"
            }
        )
        assert response.status_code == 401

    def test_login_user_not_found(self, client: TestClient):
        """测试用户登录 - 用户不存在"""
        response = client.post(
            "/api/v1/user/login",
            json={
                "username": "nonexistent",
                "password": "anypass123"
            }
        )
        assert response.status_code == 401

    def test_get_user_info_success(self, client: TestClient, db_session: Session):
        """测试获取用户信息 - 成功"""
        # 创建测试用户
        user = User(
            username="infoapiuser",
            password="hash_testpass123",
            phone="13811112222"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        # 创建 token
        token = create_access_token(data={"sub": str(user.user_id)})

        # 请求用户信息
        response = client.get(
            "/api/v1/user/info",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == user.user_id
        assert data["username"] == "infoapiuser"
        assert data["phone"] == "13811112222"
        assert "create_time" in data

    def test_get_user_info_no_token(self, client: TestClient):
        """测试获取用户信息 - 未提供 token"""
        response = client.get("/api/v1/user/info")
        assert response.status_code == 401

    def test_get_user_info_invalid_token(self, client: TestClient):
        """测试获取用户信息 - 无效 token"""
        response = client.get(
            "/api/v1/user/info",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401

    def test_get_user_info_user_not_found(self, client: TestClient):
        """测试获取用户信息 - 用户不存在（token 有效但用户已删除）"""
        # 为不存在的用户创建 token
        token = create_access_token(data={"sub": "99999"})

        response = client.get(
            "/api/v1/user/info",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 404

    def test_update_user_info_success(self, client: TestClient, db_session: Session):
        """测试更新用户信息 - 成功"""
        user = User(
            username="updateapiuser",
            password="hash_testpass123",
            phone="13800000000"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        token = create_access_token(data={"sub": str(user.user_id)})

        response = client.put(
            "/api/v1/user/update",
            headers={"Authorization": f"Bearer {token}"},
            json={"phone": "13911111111"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["phone"] == "13911111111"

    def test_update_user_info_clear_phone(self, client: TestClient, db_session: Session):
        """测试更新用户信息 - 清空手机号"""
        user = User(
            username="clearphoneapi",
            password="hash_testpass123",
            phone="13800000000"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        token = create_access_token(data={"sub": str(user.user_id)})

        response = client.put(
            "/api/v1/user/update",
            headers={"Authorization": f"Bearer {token}"},
            json={"phone": None}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["phone"] is None

    def test_update_user_info_no_token(self, client: TestClient):
        """测试更新用户信息 - 未提供 token"""
        response = client.put(
            "/api/v1/user/update",
            json={"phone": "13900000000"}
        )
        assert response.status_code == 401

    def test_check_user_exist_true(self, client: TestClient, db_session: Session):
        """测试检查用户是否存在 - 存在"""
        user = User(
            username="existapiuser",
            password="hash_testpass123"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        response = client.get(f"/api/v1/user/exist?user_id={user.user_id}")
        assert response.status_code == 200
        assert response.json()["exists"] is True

    def test_check_user_exist_false(self, client: TestClient):
        """测试检查用户是否存在 - 不存在"""
        response = client.get("/api/v1/user/exist?user_id=99999")
        assert response.status_code == 200
        assert response.json()["exists"] is False

    def test_check_user_exist_no_param(self, client: TestClient):
        """测试检查用户是否存在 - 缺少参数"""
        response = client.get("/api/v1/user/exist")
        assert response.status_code == 422
