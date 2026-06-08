from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from typing import List

from app.extensions import db

class Trainer(db.Model):
    __tablename__ = "trainers"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True
    )

    user: Mapped["User"] = relationship(
        back_populates="trainer"
    )

    clients: Mapped[List["Client"]] = relationship(
        back_populates="trainer"
    )

    routines: Mapped[List["Routine"]] = relationship(
        back_populates="trainer",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id
        }