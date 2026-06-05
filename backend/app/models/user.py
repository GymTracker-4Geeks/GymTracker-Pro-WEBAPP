from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from extensions import db

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password: Mapped[str] = mapped_column(String(256))
    role: Mapped[str] = mapped_column(String(50))

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
            "role": self.role
        }