# Use an official Python runtime as a parent image
FROM python:3.9-bullseye

# Set the working directory
WORKDIR /app

# Copy the application files
COPY app/ /app/

RUN pip install --no-cache-dir --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org streamlit requests
# # Install dependencies
# RUN pip install --no-cache-dir streamlit requests

# Expose the Streamlit default port
EXPOSE 8501

# Command to run the Streamlit app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
