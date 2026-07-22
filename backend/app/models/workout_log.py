from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Float, DateTime
from datetime import datetime, UTC


from app.extensions import db

class WorkoutLog(db.Model):
    __tablename__ = "workout_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id")
    )
    exercise_id: Mapped[int] = mapped_column(
        ForeignKey("exercises.id")
    )
    weight: Mapped[float] = mapped_column(Float)
    reps: Mapped[int] = mapped_column()
    sets: Mapped[int] = mapped_column()
    performed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC)
    )

    client: Mapped["Client"] = relationship(
        back_populates="workout_logs"
    )

    exercise: Mapped["Exercise"] = relationship(
        back_populates="workout_logs"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "exercise_id": self.exercise_id,
            "weight": self.weight,
            "reps": self.reps,
            "sets": self.sets,
            "performed_at": self.performed_at.isoformat(),
            "exercise_name": self.exercise.name if self.exercise else None
        }