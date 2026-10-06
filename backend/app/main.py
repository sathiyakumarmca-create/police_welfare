from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import re

from .database import engine, Base, get_db
from . import models, schemas, crud

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Police Welfare API (காவலர் குடும்ப நல அறக்கட்டளை)",
    description="Backend API for Police Family Welfare Registration System",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "Police Welfare API",
        "message": "Backend service is running. Use /api/* endpoints for the app data.",
        "docs": "/docs",
        "trust": "காவலர் குடும்ப நல அறக்கட்டளை",
        "location": "Madurai, Tamil Nadu"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Police Welfare API",
        "trust": "காவலர் குடும்ப நல அறக்கட்டளை",
        "location": "Madurai, Tamil Nadu"
    }

@app.post("/api/members/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    try:
        created_member = crud.create_member(db=db, member=member)
        return {
            "success": True,
            "message": "Member registered successfully! / உறுப்பினர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!",
            "data": created_member.to_dict()
        }
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except Exception as err:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration error: {str(err)}"
        )

@app.get("/api/members", response_model=dict)
def get_all_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    members = crud.get_members(db=db, skip=skip, limit=limit)
    return {
        "success": True,
        "count": len(members),
        "data": [m.to_dict() for m in members]
    }

@app.get("/api/members/check-duplicate")
def check_duplicate(
    mobile: Optional[str] = Query(None),
    aadhaar: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    mobile_exists = False
    aadhaar_exists = False

    if mobile:
        clean_mobile = re.sub(r"\D", "", mobile)
        if len(clean_mobile) == 12 and clean_mobile.startswith("91"):
            clean_mobile = clean_mobile[2:]
        elif len(clean_mobile) == 11 and clean_mobile.startswith("0"):
            clean_mobile = clean_mobile[1:]
        if crud.get_member_by_mobile(db, clean_mobile):
            mobile_exists = True

    if aadhaar:
        clean_aadhaar = re.sub(r"\D", "", aadhaar)
        if crud.get_member_by_aadhaar(db, clean_aadhaar):
            aadhaar_exists = True

    return {
        "mobile_exists": mobile_exists,
        "aadhaar_exists": aadhaar_exists
    }
