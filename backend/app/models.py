import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Index
from .database import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True, default="")
    
    # Mandatory & Unique Fields
    mobile_number = Column(String(15), unique=True, index=True, nullable=False)
    aadhaar_number = Column(String(12), unique=True, index=True, nullable=False)
    
    # Police Welfare Details
    state = Column(String(100), nullable=True, default="Tamil Nadu")
    district = Column(String(100), nullable=True, default="Tamil Nadu")
    police_unit = Column(String(100), nullable=True, default="")
    designation = Column(String(100), nullable=True, default="")

    # Tamil Nadu Police Family Specific Fields
    police_officer_name = Column(String(150), nullable=True, default="") # பணிபுரியின்/ஓய்வு பெற்ற காவலர் பெயர்
    police_belt_no = Column(String(50), nullable=True, default="")       # காவலர் எண் (Belt/GPF/ID No)
    relationship = Column(String(100), nullable=True, default="")        # உறுப்பினருக்கு உறவு முறை (கணவன், மனைவி, அம்மா, அப்பா, பிள்ளைகள் 18 வயதுக்கு மேல்...)
    is_retired = Column(String(20), nullable=True, default="No")          # ஓய்வு பெற்ற காவலரா (Yes/No)
    retirement_year = Column(String(10), nullable=True, default="")      # எந்த வருடம் பணி ஓய்வு பெற்றார்
    family_details = Column(Text, nullable=True, default="")             # அவரது கணவர், மனைவி பிள்ளைகள் விவரங்கள்

    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "mobile_number": self.mobile_number,
            "aadhaar_number": self.aadhaar_number,
            "state": self.state,
            "district": self.district,
            "police_unit": self.police_unit,
            "designation": self.designation,
            "police_officer_name": self.police_officer_name,
            "police_belt_no": self.police_belt_no,
            "relationship": self.relationship,
            "is_retired": self.is_retired,
            "retirement_year": self.retirement_year,
            "family_details": self.family_details,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
