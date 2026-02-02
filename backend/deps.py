from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from uuid import UUID
from database import get_db
from models import User
from config import settings

# OAuth2 scheme setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Dependency to get the current user from the token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials😞",
    )
    try: 
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        # This is actually the email address!
        user_email: str = payload.get("sub") 
        if user_email is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception
    
    # FETCH BY EMAIL: This matches what you stored in the token during login
    user = db.query(User).filter(User.email == user_email).first()
    
    if user is None:
        raise credentials_exception
    return user