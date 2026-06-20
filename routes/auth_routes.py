from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database.database import SessionLocal
from database.models import User
from auth.hashing import hash_password

from auth.hashing import(
    hash_password, 
    verify_password
)

from auth.token import create_access_token

router = APIRouter()

class RegisterRequest(BaseModel):

    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email:str
    password: str    

@router.post("/register")
async def register(data: RegisterRequest):

    db = SessionLocal()

    # CHECK EMAIL
    existing_email = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # CHECK USERNAME
    existing_username = db.query(User).filter(
        User.username == data.username
    ).first()

    if existing_username:

        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    # CREATE USER
    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    db.close()

    return {
        "message": "User created successfully"
    }

@router.post("/login")
async def login(data: LoginRequest):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        data.password,
        user.password
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": user.email
    })

    return {
        "access_token": access_token,
        "user": {
            "email": user.email,
            "username": user.username
        }
    }

