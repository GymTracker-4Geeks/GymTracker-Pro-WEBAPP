from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from typing import List

from app.extensions import db

class Client(db.Model):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True
    )
    trainer_id: Mapped[int] = mapped_column(
        ForeignKey("trainers.id")
    )

    user: Mapped["User"] = relationship(
        back_populates="client"
    )

    trainer: Mapped["Trainer"] = relationship(
        back_populates="clients"
    )

    workout_logs: Mapped[List["WorkoutLog"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan"
    )

    body_weights: Mapped[List["BodyWeight"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "trainer_id": self.trainer_id
        }