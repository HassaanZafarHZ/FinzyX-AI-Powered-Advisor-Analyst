import os
import psycopg2
from urllib.parse import urlparse

# Load .env manually
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            line_str = line.strip()
            if line_str and not line_str.startswith("#"):
                if "=" in line_str:
                    key, val = line_str.split("=", 1)
                    val = val.strip().strip('"').strip("'")
                    os.environ[key.strip()] = val

DATABASE_URL = os.getenv("DATABASE_URL")
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code VARCHAR;")
    cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code_expires_at TIMESTAMP;")
    print("Migration successful! Columns added to users table.")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
