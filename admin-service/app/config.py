from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8003
    DATABASE_URL: str = "sqlite:///./data/sqlite/admin.db"
    SECRET_KEY: str = "your-admin-secret-key-change-in-production-at-least-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    SHOP_SERVICE_URL: str = "http://localhost:8002"

    class Config:
        env_file = ".env"


settings = Settings()
