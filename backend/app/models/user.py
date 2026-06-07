from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from datetime import datetime, UTC
from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    role: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))

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

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at
        }