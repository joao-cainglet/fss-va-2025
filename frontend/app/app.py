import streamlit as st
import requests

# Streamlit app title
st.title("Chatbot Interface")

# Sidebar for endpoint selection
st.sidebar.title("Settings")
endpoint = st.sidebar.selectbox(
    "Select Endpoint",
    ["/api/regulatory-data", "/api/internal-data", "/api/speech-data"],
    format_func=lambda x: x.split("/")[-1].replace("-", " ").capitalize()
)

# Input field for user query
query = st.text_input("Enter your query:")

# Button to send query
if st.button("Send"):
    if query:
        # Send query to the selected endpoint
        try:
            response = requests.get(f"http://localhost:8000{endpoint}", params={"query": query})
            if response.status_code == 200:
                st.success(response.json().get("message", "No response message"))
            else:
                st.error(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            st.error(f"Failed to connect to the server: {e}")
    else:
        st.warning("Please enter a query.")
