from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Report, Company, User
from schemas import ReportCreate, ReportOut, ReportUpdateStatus
from deps import get_current_user
from email_service import send_email

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/submit/{company_token}", response_model=ReportOut)
def submit_report(
    company_token: str,
    report_in: ReportCreate,
    db: Session = Depends(get_db),
):
    """
    Public endpoint: employees submit reports w the "magic link" token.
    Auth isn't required here.
    """
    
    # Verify company token
    company = db.query(Company).filter(Company.token == company_token).first()
    if not company:
        raise HTTPException(status_code=404, detail="Invalid company link🧐")
    
    # Creating the report
    report = Report(
        company_id=company.id,
        title=report_in.title,
        description=report_in.description,
        is_anonymous=report_in.is_anonymous,
        contact_info=None if report_in.is_anonymous else report_in.contact_info,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # Notify company managers via email
    managers : list[User] = company.users
    for manager in managers:
        send_email(
            to_email=manager.email,
            subject="New Whistleblower Report Submitted🥷🏻",
            content=f"A new report titled '{report.title}' has been submitted to your company👀\n Please log in to review it.",
        )
    return report

# Endpoint for company managers to list reports
@router.get("/", response_model=List[ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Managers would see only reports related to their company
    """
    reports = (
        db.query(Report)
        .filter(Report.company_id == current_user.company_id)
        .order_by(Report.id.desc())
        .all()
    )
    token = current_user.company.token
    # Attach company token for frontend use
    for r in reports:
        r.company_token = token 
        
    return reports

# Endpoint to update report status
@router.patch("/{report_id}/status", response_model=ReportOut)
def update_report_status(
    report_id: str,
    status_in: ReportUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = (
        db.query(Report)
        .filter(
            Report.id == report_id,
            Report.company_id == current_user.company_id,
        )
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found✖️")
    
    report.status = status_in.status
    db.commit()
    db.refresh(report)
    report.company_token = current_user.company.token
    return report
    
   