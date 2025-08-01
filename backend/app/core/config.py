import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/mosquito_mike_db")
    anthropic_api_key: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    environment: str = os.getenv("ENVIRONMENT", "development")
    
    # Webhook settings
    webhook_secret: Optional[str] = os.getenv("WEBHOOK_SECRET")
    
    # API settings
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()