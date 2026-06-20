from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base

class PromptHistory(Base):

    __tablename__ = "prompt_history"

    id = Column(Integer, primary_key=True, index = True)

    original_task = Column(Text)

    generated_prompt = Column(Text)

    optimized_prompt = Column(Text)

    evaluation = Column(Text)

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True
    )

    email = Column(
        String,
        unique=True
    )

    password = Column(String)    