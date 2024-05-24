FROM python:3.12
WORKDIR /app
COPY requirements.txt req.txt
COPY . .
EXPOSE 8080
CMD ["python3", "app.py"]

