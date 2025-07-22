from sqlalchemy import create_engine
from models import Base

engine = create_engine('sqlite:///patients.db')
Base.metadata.create_all(engine)

print("Database initialized successfully.")