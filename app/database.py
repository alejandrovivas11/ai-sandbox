import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

_BASE_DIR = Path(__file__).resolve().parent.parent
_DEFAULT_DB_URL = f"sqlite:///{_BASE_DIR / 'sandbox.db'}"

DATABASE_URL = os.getenv("DATABASE_URL", _DEFAULT_DB_URL)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
