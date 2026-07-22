from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, JSON
from typing import Optional

from app.extensions import db

class ExerciseLibrary(db.Model):
    __tablename__ = "exercise_library"

    id: Mapped[int] = mapped_column(primary_key=True)
    external_id: Mapped[str] = mapped_column(String(10), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    body_part: Mapped[str] = mapped_column(String(100), index=True)
    target: Mapped[str] = mapped_column(String(100), index=True)
    equipment: Mapped[str] = mapped_column(String(100), index=True)
    secondary_muscles: Mapped[Optional[list]] = mapped_column(JSON)
    instructions: Mapped[Optional[str]] = mapped_column(Text)
    image_url: Mapped[Optional[str]] = mapped_column(String(500))
    gif_url: Mapped[Optional[str]] = mapped_column(String(500))

    def to_dict(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "name": self.name,
            "body_part": self.body_part,
            "target": self.target,
            "equipment": self.equipment,
            "secondary_muscles": self.secondary_muscles,
            "instructions": self.instructions,
            "image_url": self.image_url,
            "gif_url": self.gif_url,
        }
