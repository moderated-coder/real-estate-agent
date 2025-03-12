from typing import Optional
from sqlmodel import Field, SQLModel


class UnitCode(SQLModel, table=True):
    """
    Model representing legal administrative unit codes in Korea.
    Only includes units that currently exist (status='존재').
    """
    __tablename__ = "unit_codes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    unit_code: str = Field(index=True, unique=True)
    dongname: str = Field(index=True) 