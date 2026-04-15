"""
购物 API 单元测试
测试左移 - 补写完整测试用例
"""
import pytest


def test_health_check(client):
    """测试健康检查接口"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "shop-service"
