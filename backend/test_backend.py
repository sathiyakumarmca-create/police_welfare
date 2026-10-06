import os
import pytest
from fastapi.testclient import TestClient

# Ensure test DB is used
os.environ["DATABASE_URL"] = "sqlite:///./test_police_welfare.db"

from app.main import app
from app.database import engine, Base

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_backend_root_route_returns_service_status():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Police Welfare API"

def test_successful_registration_with_new_fields():
    response = client.post("/api/members/register", json={
        "first_name": "Ramesh",
        "last_name": "Kumar",
        "mobile_number": "9876543210",
        "aadhaar_number": "123456789012",
        "district": "Madurai",
        "police_unit": "Pasumalai Station",
        "designation": "Head Constable",
        "police_officer_name": "K. Selvam",
        "police_belt_no": "HC 1420",
        "relationship": "மனைவி",
        "is_retired": "Yes",
        "retirement_year": "2020",
        "family_details": "Spouse: Ramesh, Children: 2 (Son 22, Daughter 19)"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["mobile_number"] == "9876543210"
    assert data["data"]["police_officer_name"] == "K. Selvam"
    assert data["data"]["relationship"] == "மனைவி"
    assert data["data"]["retirement_year"] == "2020"

def test_duplicate_mobile_number():
    client.post("/api/members/register", json={
        "first_name": "Ramesh",
        "last_name": "Kumar",
        "mobile_number": "9876543210",
        "aadhaar_number": "123456789012"
    })
    response = client.post("/api/members/register", json={
        "first_name": "Suresh",
        "last_name": "Rajan",
        "mobile_number": "9876543210",
        "aadhaar_number": "999988887777"
    })
    assert response.status_code == 400

def test_duplicate_aadhaar_number():
    client.post("/api/members/register", json={
        "first_name": "Ramesh",
        "last_name": "Kumar",
        "mobile_number": "9876543210",
        "aadhaar_number": "123456789012"
    })
    response = client.post("/api/members/register", json={
        "first_name": "Suresh",
        "last_name": "Rajan",
        "mobile_number": "8877665544",
        "aadhaar_number": "123456789012"
    })
    assert response.status_code == 400
