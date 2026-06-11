from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from typing import List
from app.extensions import db

class Diet(db.Model):
    __tablename__ = "diets"

    id: Mapped[int] = mapped_column(primary_key=True)

    trainer_id: Mapped[int] = mapped_column(
        ForeignKey("trainers.id"),
        nullable=False
    )

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"),
        nullable=False
    )

    name_diet: Mapped[str] = mapped_column(String(120), nullable=False)
    goal_diet: Mapped[str] = mapped_column(String(120), nullable=False)

    trainer: Mapped["Trainer"] = relationship(
        back_populates="diets"
    )

    client: Mapped["Client"] = relationship(
        back_populates="diets"
    )

    diet_meals: Mapped[List["DietMeal"]] = relationship(
        back_populates="diet",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "trainer_id": self.trainer_id,
            "client_id": self.client_id,
            "name_diet": self.name_diet,
            "goal_diet": self.goal_diet
        }
    
    