from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from typing import List
from extensions import db

class ClientRoutine(db.Model):
    __tablename__ = "clientroutine"

    id: Mapped[int] = mapped_column(primary_key= True)
    
    routine_id: Mapped[int]= mapped_column(
        ForeignKey("routines.id"),
        nullable= False
    )

    routine: Mapped["Routine"]= relationship(
        
        back_populates= "client_routines"
    )


    client_id: Mapped[int]= mapped_column(
        ForeignKey("clients.id"),
        nullable= False
    )

    client: Mapped["Client"]= relationship(

        back_populates="client_routines"
    )

    