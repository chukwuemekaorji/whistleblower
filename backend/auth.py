from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import secrets

from database import get_db
from models import User, Company
from schemas import UserCreate, UserLogin, UserOut, Token, CompanyOut
from config import settings
from deps import get_current_user
from fastapi.security import OAuth2PasswordRequestForm 

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Creating a new user and the company related to the person
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verifying a plain password against a hashed password
def verify_password(plain_password: str, hashed: str) -> bool:
    return pwd_context.verify(plain_password, hashed)

# Creating JWT tokens
def create_access_token(subject: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)

@router.post("/signup", response_model=UserOut)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    
    # 1. Check if email/user exists already
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email has been previously registered☺️")
    
    # 2. Check if the company exists by NAME
    company = db.query(Company).filter(Company.name == user_in.company_name).first()
    
    # 3. If it doesn't exist, create it. If it does, we just use the existing one!
    if not company:
        token = secrets.token_urlsafe(16)
        company = Company(name=user_in.company_name, token=token)
        db.add(company)
        db.flush()  # Gets the ID for the company
    
    # 4. Create the actual user linked to that company (new or existing)
    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        company_id=company.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Endpoint for user login
@router.post("/login")
def login(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # 1. Find the user by email (form_data.username)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # 2. Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401, 
            detail="Either your email or password is incorrect😱",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Create the JWT token
    access_token = create_access_token(subject=user.email)
    
    return {"access_token": access_token, "token_type": "bearer"}
    
@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/company", response_model=CompanyOut)
def get_company(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # This now only returns the company belonging to the logged-in user
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found🤷‍♂️")
    return company