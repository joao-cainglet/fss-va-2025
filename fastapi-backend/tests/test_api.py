import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}  # Adjust based on your actual response

def test_create_item():
    response = client.post("/items/", json={"name": "item1", "description": "A test item"})
    assert response.status_code == 201
    assert response.json()["name"] == "item1"