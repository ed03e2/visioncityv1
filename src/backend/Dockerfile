# Use a base image with geopandas and science packages
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc g++ curl git \
    libpq-dev gdal-bin libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the port your Flask app runs on
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]

