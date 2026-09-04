from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(String, unique=True, index=True)
    timestamp_reported = Column(DateTime)
    timestamp_fraud_occurred = Column(DateTime)
    victim_bank = Column(String)
    victim_city = Column(String)
    victim_state = Column(String)
    amount = Column(Float)
    fraud_type = Column(String)
    mule_account_chain = Column(String)
    final_withdrawal_bank = Column(String)
    final_withdrawal_atm_lat = Column(Float)
    final_withdrawal_atm_lon = Column(Float)
    withdrawal_timestamp = Column(DateTime, nullable=True)
    status = Column(String)
