import re
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator

class MemberBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100, description="First Name of the member")
    last_name: Optional[str] = Field(default="", max_length=100, description="Last Name / Initial of the member")
    mobile_number: str = Field(..., description="Mandatory 10-digit mobile number")
    aadhaar_number: str = Field(..., description="Mandatory 12-digit Aadhaar Card number")
    state: Optional[str] = Field(default="Tamil Nadu", max_length=100)
    district: Optional[str] = Field(default="Tamil Nadu", max_length=100)
    police_unit: Optional[str] = Field(default="", max_length=100)
    designation: Optional[str] = Field(default="", max_length=100)
    
    # Input Parameters
    police_officer_name: Optional[str] = Field(default="", max_length=150, description="பணிபுரியின் காவலர் பெயர்")
    police_belt_no: Optional[str] = Field(default="", max_length=50, description="காவலர் எண் (Belt / ID / GPF No)")
    relationship: Optional[str] = Field(default="", max_length=100, description="உறுப்பினருக்கு உறவு முறை")
    is_retired: Optional[str] = Field(default="No", max_length=20, description="ஓய்வு பெற்ற காவலரா")
    retirement_year: Optional[str] = Field(default="", max_length=10, description="எந்த வருடம் பணி ஓய்வு பெற்றார்")
    family_details: Optional[str] = Field(default="", description="அவரது கணவர், மனைவி பிள்ளைகள் விவரங்கள்")

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        clean_val = re.sub(r"\D", "", v)
        if len(clean_val) == 12 and clean_val.startswith("91"):
            clean_val = clean_val[2:]
        elif len(clean_val) == 11 and clean_val.startswith("0"):
            clean_val = clean_val[1:]
            
        if len(clean_val) != 10:
            raise ValueError("Mobile number must contain exactly 10 digits / கைப்பேசி எண் 10 இலக்கங்களை கொண்டிருக்க வேண்டும்.")
        if not clean_val[0] in "6789":
            raise ValueError("Mobile number must start with 6, 7, 8, or 9 / கைப்பேசி எண் 6, 7, 8, அல்லது 9-ல் தொடங்க வேண்டும்.")
        return clean_val

    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar(cls, v: str) -> str:
        clean_val = re.sub(r"\D", "", v)
        if len(clean_val) != 12:
            raise ValueError("Aadhaar Card number must contain exactly 12 digits / ஆதார் எண் 12 இலக்கங்களை கொண்டிருக்க வேண்டும்.")
        return clean_val

class MemberCreate(MemberBase):
    pass

class MemberResponse(MemberBase):
    id: int
    created_at: str

    model_config = ConfigDict(from_attributes=True)

class CheckUniquenessRequest(BaseModel):
    mobile_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
