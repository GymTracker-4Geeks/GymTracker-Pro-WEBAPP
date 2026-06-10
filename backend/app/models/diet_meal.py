from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from app.extensions import db

class DietMeal(db.Model):
    __tablename__ = "dietmeals"

    id: Mapped[int] = mapped_column(primary_key=True)

    diet_id: Mapped[int] = mapped_column(
        ForeignKey("diets.id"),
        nullable=False
    )

    meal_number: Mapped[int] = mapped_column(nullable=False)

    description: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    diet: Mapped["Diet"] = relationship(
        back_populates="diet_meals"
    )