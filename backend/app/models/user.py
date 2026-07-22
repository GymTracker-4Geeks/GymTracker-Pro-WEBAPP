from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import String, DateTime
from typing import Optional
from datetime import datetime, timedelta, UTC
import secrets

from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    role: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))

    token_password_reset: Mapped[Optional[str]] = mapped_column(String(100))
    token_password_reset_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    trainer: Mapped["Trainer"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    client: Mapped["Client"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    admin: Mapped["Admin"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def generate_reset_token(self):
        self.token_password_reset = secrets.token_hex(16)
        self.token_password_reset_expires_at = datetime.now(UTC) + timedelta(minutes=15)
        return self.token_password_reset

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at
        }