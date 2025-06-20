import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_very_secret_key_for_development'
    # PostgreSQL Database URI from Supabase (Transaction Pooler - IPv4 Compatible)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres.gdwoqyzedxtsslpmfejq:DPL0TRRUvsBQdgoD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 