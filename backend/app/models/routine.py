from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Text
from typing import List

from app.extensions import db

class Routine(db.Model):
    __tablename__ = "routines"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    trainer_id: Mapped[int] = mapped_column(
        ForeignKey("trainers.id")
    )

    trainer: Mapped["Trainer"] = relationship(
        back_populates="routines"
    )

    exercises: Mapped[List["Exercise"]] = relationship(
        back_populates="routine",
        cascade="all, delete-orphan"
    )

    clients: Mapped[List["ClientRoutine"]] = relationship(
        back_populates="routine",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "trainer_id": self.trainer_id,
            "assigned_count": len(self.clients) if self.clients else 0,
            "exercises": [{
                "id": ex.id,
                "name": ex.name,
                "reps": ex.reps,
                "sets": ex.sets,
                "muscle_group": ex.muscle_group,
                "library_exercise_id": ex.library_exercise_id,
            } for ex in self.exercises] 
        }