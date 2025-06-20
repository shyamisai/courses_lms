import psycopg2
import os

# Use the same connection string as in config.py
DATABASE_URL = os.environ.get('DATABASE_URL') or 'postgresql://postgres.gdwoqyzedxtsslpmfejq:DPL0TRRUvsBQdgoD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

try:
    cur.execute("""
        ALTER TABLE course_file ADD COLUMN IF NOT EXISTS module_id INTEGER REFERENCES module(id) ON DELETE CASCADE;
    """)
    cur.execute("""
        ALTER TABLE module ADD COLUMN IF NOT EXISTS description TEXT;
    """)
    cur.execute("""
        ALTER TABLE module ADD COLUMN IF NOT EXISTS release_date TIMESTAMP;
    """)
    cur.execute("""
        ALTER TABLE course ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(255);
    """)
    conn.commit()
    print("Successfully added module_id to course_file, description/release_date to module, and youtube_url to course.")
except Exception as e:
    print(f"Error: {e}")
finally:
    cur.close()
    conn.close() 