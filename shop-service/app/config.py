from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8002
    DATABASE_URL: str = "sqlite:///./data/sqlite/shop.db"
    USER_SERVICE_URL: str = "http://localhost:8001"
    SECRET_KEY: str = "your-secret-key-change-in-production-at-least-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    class Config:
        env_file = ".env"


settings = Settings()
