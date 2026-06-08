from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from typing import List

from app.extensions import db

class Exercise(db.Model):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    sets: Mapped[int] = mapped_column()
    reps: Mapped[int] = mapped_column()
    muscle_group: Mapped[str] = mapped_column(String(100))
    routine_id: Mapped[int] = mapped_column(
        ForeignKey("routines.id")
    )

    routine: Mapped["Routine"] = relationship(
        back_populates="exercises"
    )

    workout_logs: Mapped[List["WorkoutLog"]] = relationship(
        back_populates="exercise"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sets": self.sets,
            "reps": self.reps,
            "muscle_group": self.muscle_group,
            "routine_id": self.routine_id
        }