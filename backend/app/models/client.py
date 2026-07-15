from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Float
from typing import List, Optional

from app.extensions import db

class Client(db.Model):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True
    )
    trainer_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("trainers.id")
    )
    height: Mapped[Optional[float]] = mapped_column(Float)

    user: Mapped["User"] = relationship(
        back_populates="client"
    )

    trainer: Mapped["Trainer"] = relationship(
        back_populates="clients"
    )

    routines: Mapped[List["ClientRoutine"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan"
    )

    workout_logs: Mapped[List["WorkoutLog"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan"
    )

    body_weights: Mapped[List["BodyWeight"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan"
    )

    sessions: Mapped[List["Session"]] = relationship(
        back_populates="client", 
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "trainer_id": self.trainer_id,
            "height": self.height,
            "routine_ids": [routine.routine_id for routine in self.routines] if self.routines else []
        }