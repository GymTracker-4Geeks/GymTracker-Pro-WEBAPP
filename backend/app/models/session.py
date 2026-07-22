from datetime import date
from typing import Optional
from sqlalchemy import ForeignKey, String, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db

class Session(db.Model):
    __tablename__ = 'sessions'

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    hour: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="1-a-1")
    color: Mapped[str] = mapped_column(String(30), default="bg-primary/90")

    client_id: Mapped[int] = mapped_column(ForeignKey('clients.id'), nullable=False)
    trainer_id: Mapped[int] = mapped_column(ForeignKey('trainers.id'), nullable=False)

    client: Mapped[Optional["Client"]] = relationship("Client", back_populates="sessions")
    trainer: Mapped[Optional["Trainer"]] = relationship("Trainer", back_populates="sessions")

    def to_dict(self) -> dict:
        client_name = "No Client"
        if self.client and self.client.user:
            client_name = self.client.user.full_name

        return {
            "id": self.id,
            "date": self.date.strftime("%Y-%m-%d"),
            "hour": self.hour,
            "type": self.type,
            "color": self.color,
            "client": client_name,
            "client_id": self.client_id,
            "trainer_id": self.trainer_id
        }
