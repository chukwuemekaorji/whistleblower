🛡️ Whistleblower Reporting MVP

A secure, multi-tenant whistleblower reporting platform designed to make internal reporting frictionless for employees while giving managers a private dashboard to track and resolve issues.
The project prioritizes anonymity, data isolation, and local-first reviewability using Docker.

🎯 Project Goal
Employees are often hesitant to report issues when the process is complicated or requires an account.
This MVP removes that friction by using Magic Links, allowing anonymous submissions while ensuring that each company’s data remains strictly isolated.

🛠️ Tech Stack
Backend

Python (FastAPI)
SQLAlchemy (ORM)
PostgreSQL
Security & Validation
Pydantic
JWT-based authentication
Passlib (bcrypt) for password hashing

Frontend

React (Vite)
Axios

Infrastructure
Docker & Docker Compose

Email
SendGrid (optional for local testing)

🚀 How to Run (Local / Docker)

⚠️ Important: On first run, PostgreSQL needs a few seconds to initialize before the backend can connect.
To avoid startup issues, start the services in two steps.

Prerequisites:
Docker Desktop installed and running

1️⃣ Clone the Repository on your IDE
git clone https://github.com/chukwuemekaorji/whistleblower
cd whistleblower

2️⃣ Environment Setup
cp .env.example .env


ℹ️ The default values are already configured for Docker usage.
Only add a SendGrid API key if you want to test live emails.

3️⃣ Start Database First (Terminal 1)
docker compose up -d db


Wait 5–10 seconds for PostgreSQL to fully initialize, then run:

docker compose restart backend


Once running, you should see:

Application startup complete.
Uvicorn running on http://0.0.0.0:8000


📘 API Docs (Swagger):
http://localhost:8000/docs

4️⃣ Start the Frontend (Terminal 2)
docker compose up frontend


🖥️ Frontend Dashboard:
http://localhost:5173

📝 How the System Works
For Managers

Sign up and log in

Generate a unique Magic Link

Share the link with employees

Track incoming reports and update their status

For Employees

Open the Magic Link

Submit a report (anonymous or identified)

No account or login required


⚖️ MVP Trade-offs & Limitations
Text-only Reports:
No file or image uploads yet.

Simple Roles:
All authenticated users are managers.

Email Handling:
Emails are sent synchronously.
A production system would use background workers (e.g., Celery).

UI Styling:
Focus was placed on security, data isolation, and infrastructure rather than custom UI polish.