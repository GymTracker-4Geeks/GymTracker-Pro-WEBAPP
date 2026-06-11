from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Float
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
    recorded_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))
    weight: Mapped[float] = mapped_column(Float)
    reps: Mapped[int] = mapped_column()
    
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
            "reps": self.reps
        }