"""
用户 API 单元测试
待实现：测试左移 - 先写测试用例，再实现具体功能
"""
import pytest


def test_health_check(client):
    """测试健康检查接口"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "user-service"
