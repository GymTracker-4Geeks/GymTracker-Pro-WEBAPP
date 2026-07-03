from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from typing import Optional

from app.extensions import db

class ClientRoutine(db.Model):
    __tablename__ = "client_routines"

    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"), primary_key=True)
    routine_id: Mapped[int] = mapped_column(ForeignKey("routines.id"), primary_key=True)
    week_day : Mapped[Optional[str]] = mapped_column(String(120))

    client: Mapped["Client"] = relationship(back_populates="routines")
    routine: Mapped["Routine"] = relationship(back_populates="clients")

    def to_dict(self):
        return {
            "client_id": self.client_id,
            "routine_id": self.routine_id,
        }