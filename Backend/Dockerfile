FROM python:3.13.9-slim-bookworm
WORKDIR /usr/src/app
COPY ./requirements.txt .
RUN command pip install -r requirements.txt
COPY . .
CMD ["fastapi", "run", "./app/main.py"]