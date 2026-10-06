from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import models, schemas

def get_member_by_mobile(db: Session, mobile_number: str):
    return db.query(models.Member).filter(models.Member.mobile_number == mobile_number).first()

def get_member_by_aadhaar(db: Session, aadhaar_number: str):
    return db.query(models.Member).filter(models.Member.aadhaar_number == aadhaar_number).first()

def get_members(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Member).order_by(models.Member.id.desc()).offset(skip).limit(limit).all()

def create_member(db: Session, member: schemas.MemberCreate):
    # Check for existing mobile
    existing_mobile = get_member_by_mobile(db, member.mobile_number)
    if existing_mobile:
        raise ValueError("A member with this Mobile Number is already registered.")

    # Check for existing Aadhaar
    existing_aadhaar = get_member_by_aadhaar(db, member.aadhaar_number)
    if existing_aadhaar:
        raise ValueError("A member with this Aadhaar Card Number is already registered.")

    db_member = models.Member(
        first_name=member.first_name.strip(),
        last_name=(member.last_name or "").strip(),
        mobile_number=member.mobile_number,
        aadhaar_number=member.aadhaar_number,
        state=member.state or "Tamil Nadu",
        district=member.district or "Tamil Nadu",
        police_unit=member.police_unit or "",
        designation=member.designation or "",
        police_officer_name=(member.police_officer_name or "").strip(),
        police_belt_no=(member.police_belt_no or "").strip(),
        relationship=(member.relationship or "").strip(),
        is_retired=member.is_retired or "No",
        retirement_year=(member.retirement_year or "").strip(),
        family_details=(member.family_details or "").strip()
    )
    
    try:
        db.add(db_member)
        db.commit()
        db.refresh(db_member)
        return db_member
    except IntegrityError as e:
        db.rollback()
        if "mobile_number" in str(e).lower():
            raise ValueError("Mobile number already registered in database.")
        elif "aadhaar_number" in str(e).lower():
            raise ValueError("Aadhaar Card number already registered in database.")
        else:
            raise ValueError("Registration failed due to a duplicate unique record.")
