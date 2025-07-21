# Run the Backend: 

`uvicorn app.main:app --reload`

## Test the API endpoints: 

`GET http://127.0.0.1:8000/api/regulatory-data?query=example`

`GET http://127.0.0.1:8000/api/internal-data?query=example`

`GET http://127.0.0.1:8000/api/speech-data?query=example`


## View API Documentation: 
FastAPI automatically generates interactive API documentation. Visit:
Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http:/


# Run the Frontend:

`streamlit run app/app.py --server.port=8501 --server.address=0.0.0.0`



# build docker images:
`cd frontend`
`docker build -t streamlit-chatbot .`

## run the container
`docker run -p 8501:8501 streamlit-chatbot`
