from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Base
from database import engine
from auth import router as auth_router
from reports import router as reports_router

# 1. Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Whistleblower Reporting System")

# 2. CORS Middleware
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include Routers
app.include_router(auth_router)
app.include_router(reports_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Whistleblower Reporting System API🚀"}