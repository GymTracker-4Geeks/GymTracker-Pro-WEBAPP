from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from app.extensions import db

class Admin(db.Model):
    __tablename__ = "admins"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True
    )

    user: Mapped["User"] = relationship(
        back_populates="admin"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
        }