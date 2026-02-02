FROM python:3.11-slim
WORKDIR /app

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements from the current directory (backend/)
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from the backend folder into /app
COPY . .

# Start the app
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]