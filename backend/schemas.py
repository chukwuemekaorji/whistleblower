from pydantic import BaseModel, EmailStr 
from uuid import UUID
from typing import Optional, List
from enum import Enum

# Define ReportStatus here to avoid circular import
class ReportStatus(str, Enum):
    NEW = "NEW"
    IN_REVIEW = "IN_REVIEW"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"

# Company schemas
class CompanyOut(BaseModel):
    id: UUID
    name: str
    token: str
    
    class Config:
        from_attributes = True

# Auth schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    company_id: UUID
    company: CompanyOut
    
    class Config:
        from_attributes = True
        
# Report schemas
class ReportCreate(BaseModel):
    title: str
    description: str
    is_anonymous: bool = False
    contact_info: Optional[str] = None
    
# Report output schema
class ReportOut(BaseModel):
    id: UUID
    company_id: UUID
    title: str
    description: str
    status: ReportStatus
    is_anonymous: bool
    contact_info: Optional[str] = None
    company_token: Optional[str] = None 
    
    class Config:
        from_attributes = True

# Report status update schema
class ReportUpdateStatus(BaseModel):
    status: ReportStatus
    
#  Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
