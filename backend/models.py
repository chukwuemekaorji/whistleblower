import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import enum


# Report status enum for database
class ReportStatus(str, enum.Enum):
    NEW = "NEW"
    PENDING = "PENDING"
    IN_REVIEW = "IN_REVIEW"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"
    
class Company(Base):
    __tablename__ = "companies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    token = Column(String, unique=True, nullable=False) # the magic token for authentication
    
    users = relationship("User", back_populates="company")
    reports = relationship("Report", back_populates="company")
    
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    
    company = relationship("Company", back_populates="users")
    
class Report(Base):
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.NEW, nullable=False)
    is_anonymous = Column(Boolean, default=False, nullable=False)
    contact_info = Column(String, nullable=True)
    
    company = relationship("Company", back_populates="reports")
