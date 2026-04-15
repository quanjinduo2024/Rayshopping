#!/usr/bin/env python
"""
User Service 测试运行脚本
支持 Windows 和 Linux/Mac
"""
import sys
import os
import subprocess
from pathlib import Path


def run_command(cmd, cwd=None):
    """运行命令并返回结果"""
    print(f"$ {cmd}")
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Error: {e}")
        return False


def main():
    """主函数"""
    print("=" * 50)
    print("Rayshopping User Service 测试")
    print("=" * 50)
    print()

    # 切换到脚本所在目录
    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    # 检查 Python
    print("[1/6] 检查 Python...")
    if not run_command(f"{sys.executable} --version"):
        print("错误: 无法运行 Python")
        return 1
    print()

    # 检查 bcrypt 检查
    print("[2/6] 检查 bcrypt 版本...")
    try:
        import bcrypt
        print(f"bcrypt 版本: {getattr(bcrypt, '__version__', 'unknown')}")
    except ImportError:
        print("bcrypt 未安装")
    except Exception as e:
        print(f"bcrypt 检查出错: {e}")
    print()

    # 安装依赖
    print("[3/6] 安装/检查依赖...")
    run_command(f"{sys.executable} -m pip install -r requirements.txt")
    print()

    # 测试1: 服务层测试
    print("[4/6] 运行服务层测试...")
    service_success = run_command(f"{sys.executable} -m pytest tests/unit/test_services.py -v")
    print()

    # 测试2: API层测试
    print("[5/6] 运行 API 层测试...")
    api_success = run_command(f"{sys.executable} -m pytest tests/unit/test_api.py -v")
    print()

    # 测试3: 覆盖率测试
    print("[6/6] 运行所有测试并检查覆盖率...")
    cov_success = run_command(f"{sys.executable} -m pytest --cov=app --cov-report=term-missing --cov-fail-under=80 -v")
    print()

    # 总结
    print("=" * 50)
    print("测试总结")
    print("=" * 50)
    print(f"服务层测试: {'✓ 通过' if service_success else '✗ 失败'}")
    print(f"API 层测试: {'✓ 通过' if api_success else '✗ 失败'}")
    print(f"覆盖率测试: {'✓ 通过 (≥80%)' if cov_success else '✗ 未达标'}")
    print()

    if service_success and api_success and cov_success:
        print("✓ 所有测试通过！")
        return 0
    else:
        print("✗ 部分测试失败，请检查上面的输出")
        return 1


if __name__ == "__main__":
    sys.exit(main())
