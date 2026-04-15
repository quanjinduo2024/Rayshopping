from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import user
from app.database import engine, Base

app = FastAPI(
    title="Rayshopping User Service",
    description="用户管理与认证服务",
    version="0.1.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(user.router, prefix="/api/v1", tags=["user"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "user-service"}


@app.on_event("startup")
def startup_event():
    """启动时创建数据库表"""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.ENVIRONMENT == "development")
