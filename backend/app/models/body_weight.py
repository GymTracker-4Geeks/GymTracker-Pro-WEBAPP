from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Float
from datetime import datetime, UTC
from app.extensions import db

class BodyWeight(db.Model):
    __tablename__ = "body_weights"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id")
    )
    weight: Mapped[float] = mapped_column(Float)
    recorded_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))

    client: Mapped["Client"] = relationship(
        back_populates="body_weights"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "weight": self.weight
        }