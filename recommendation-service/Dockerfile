FROM python:3.9-slim

# Create app directory with proper permissions
WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install dependencies with explicit user
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy application code
COPY . .

# Make sure the user has permissions
RUN chmod +x /app

# Run with the python user base
ENV PATH="/home/python/.local/bin:${PATH}"
ENV PYTHONPATH="/home/python/.local/lib/python3.9/site-packages"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]