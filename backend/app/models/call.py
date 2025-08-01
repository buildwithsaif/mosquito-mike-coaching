from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Call(Base):
    __tablename__ = "calls"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    audio_file_path = Column(String(500))
    transcript = Column(Text)
    duration = Column(Float)  # Duration in minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    analyses = relationship("CallAnalysis", back_populates="call", cascade="all, delete-orphan")
    objections = relationship("Objection", back_populates="call", cascade="all, delete-orphan")

class CallAnalysis(Base):
    __tablename__ = "call_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey("calls.id"), nullable=False)
    analysis_type = Column(String(100), nullable=False)  # e.g., "coaching_feedback", "objection_handling"
    content = Column(Text, nullable=False)
    confidence_score = Column(Float)  # AI confidence score 0-1
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    call = relationship("Call", back_populates="analyses")

class Objection(Base):
    __tablename__ = "objections"
    
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey("calls.id"), nullable=False)
    objection_text = Column(Text, nullable=False)
    objection_type = Column(String(100))  # e.g., "price", "timing", "authority"
    timestamp = Column(Float)  # Time in call when objection occurred (seconds)
    response_text = Column(Text)  # How the objection was handled
    effectiveness_score = Column(Float)  # AI assessment of response effectiveness 0-1
    suggested_improvement = Column(Text)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    call = relationship("Call", back_populates="objections")