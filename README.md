🛡️ Whistleblower Reporting MVP
This is a secure, multi-tenant reporting platform built to help companies handle internal whistleblowing. The goal was to create a friction-less experience for employees (no accounts needed) while giving managers a robust, private dashboard to track and resolve issues.

🎯 The Goal
I built this to solve a common problem: employees are often afraid to report issues if the process is complicated or requires a login. By using "Magic Links," we ensure anonymity and ease of use, while the backend ensures that company data stays strictly isolated.

🛠️ Tech Stack
I chose this stack for performance, safety, and rapid development:
Backend: Python (FastAPI), SQLAlchemy (ORM), and PostgreSQL.

Validation & Security: Pydantic for data integrity, JWT for sessions, and Passlib (bcrypt) for password hashing.

Frontend: React (Vite) with Axios for a fast, responsive UI.

Infrastructure: Fully containerized with Docker and Docker Compose.

Communications: Integrated with SendGrid for real-time email alerts.

🚀 How to Run (Step-by-Step)
Since the entire project is Dockerized, you don’t need to worry about installing Python, Node, or Postgres on your machine.

1. Prerequisites
Make sure you have Docker Desktop installed and running.

Download Docker Desktop

2. Clone & Setup
Open your terminal and run:
git clone https://github.com/chukwuemekaorji/whistleblower
cd whistleblower

3. Environment Config
Copy the example environment file. The defaults are already set up to work with the Docker containers:
cp .env.example .env
(Note: If you want to test live emails, add your SendGrid API key inside this .env file.)

4. Fire it up
Build and start the system with one command:
docker-compose up --build

🔗 Quick Links
Once the containers are running, you can access the app here:
Manager Dashboard (Frontend): http://localhost:5173
API Documentation (Swagger): http://localhost:8000/docs

📝 How it Works
For Managers
Sign up and log in.

Grab your Unique Magic Link from the dashboard.

Share that link with your team.

Track new reports in real-time and update their status (In Review, Resolved, etc.).

For Employees
Open the company's magic link.

Fill out the report—choose to stay 100% anonymous or provide contact info.

Hit submit. No account creation or login required.

⚖️ Trade-offs & MVP Limitations
To meet the project timeline while maintaining high security, I made the following decisions:

Local-First: I prioritized a perfect Docker setup over a cloud deployment to ensure it runs immediately for any reviewer without cost/credential hurdles.

Text-Only: To keep the data layer simple, reports are text-based for now (no file/image uploads yet).

Simple Roles: Every registered user is a Manager. Advanced Admin roles would be the next step.

Background Tasks: Emails are currently sent during the request. For high-volume production, I would move these to a background worker like Celery.

UI Focus: I focused 90% of my time on security, data isolation, and the Docker environment rather than custom UI styling.