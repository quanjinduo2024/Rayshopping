from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import goods, cart, order
from app.database import engine, Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rayshopping Shop Service",
    description="购物管理服务",
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
app.include_router(goods.router, prefix="/api/v1", tags=["goods"])
app.include_router(cart.router, prefix="/api/v1", tags=["cart"])
app.include_router(order.router, prefix="/api/v1", tags=["order"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "shop-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.ENVIRONMENT == "development")
