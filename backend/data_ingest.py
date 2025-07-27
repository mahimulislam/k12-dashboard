#!/usr/bin/env python3
"""
Data Ingest Script for K-12 LLM Tutor Dashboard
Demonstrates CSV → Hash → PostgreSQL pipeline with privacy safeguards
"""

import hashlib
import csv
import os
import psycopg2
from datetime import datetime
import sys

# Database configuration (use environment variables in production)
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'edtech_dashboard'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_active_salt(cursor):
    """Retrieve the active salt from database"""
    cursor.execute("SELECT salt_value FROM salt_store WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1")
    result = cursor.fetchone()
    if not result:
        raise Exception("No active salt found in database")

    salt_value = result[0]
    # Ensure salt_value is bytes
    if isinstance(salt_value, memoryview):
        return salt_value.tobytes()
    return salt_value # Assume it's already bytes if not memoryview

def hash_student_id(student_id, salt):
    """Hash student ID with salt using SHA-256"""
    # Ensure both salt and student_id are bytes
    if isinstance(salt, str):
        salt = salt.encode('utf-8')
    if isinstance(student_id, str):
        student_id = student_id.encode('utf-8')
    
    combined = salt + student_id
    return hashlib.sha256(combined).hexdigest()

def ingest_csv_data(csv_file_path, consent_source="Canvas Export Demo"):
    """Main ingest function"""
    try:
        # Connect to PostgreSQL
        print(f"Connecting to database at {DB_CONFIG['host']}:{DB_CONFIG['port']}")
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Get active salt
        salt = get_active_salt(cursor)
        print(f"Retrieved active salt from database (type: {type(salt)})")
        
        # Process CSV file
        print(f"Processing CSV file: {csv_file_path}")
        records_processed = 0
        
        with open(csv_file_path, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                # Hash the student ID
                pseudonym = hash_student_id(row['StudentID'], salt)
                
                # Insert record with hashed ID
                insert_query = """
                INSERT INTO student_records
                (pseudonym, topic, concept, score, uncertainty, interaction_type, timestamp, consent_provenance, rationale_details)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                cursor.execute(insert_query, (
                    pseudonym,
                    row['Topic'],
                    row['Concept'],
                    int(row['Score']),
                    row['Uncertainty'],
                    row['InteractionType'],
                    row['Timestamp'],
                    f"{consent_source} - {datetime.now().isoformat()}",
                    row.get('Rationale', '') # Use .get() for safety in case column is missing in old CSV
                ))
                
                records_processed += 1
                
                # Log progress (showing original ID for demo, pseudonym for verification)
                print(f"Processed: {row['StudentID']} → {pseudonym[:16]}... | {row['Topic']} - {row['Concept']}")
        
        # Commit transaction
        conn.commit()
        print(f"\n✅ Successfully ingested {records_processed} records")
        
        # Show sample of stored data (pseudonymized)
        cursor.execute("""
        SELECT pseudonym, topic, concept, score, uncertainty, timestamp 
        FROM student_records 
        ORDER BY timestamp DESC 
        LIMIT 5
        """)
        
        print("\n📊 Sample of stored records:")
        print("Pseudonym (first 16 chars) | Topic | Concept | Score | Uncertainty")
        print("-" * 80)
        for record in cursor.fetchall():
            print(f"{record[0][:16]}... | {record[1]} | {record[2]} | {record[3]} | {record[4]}")
        
        # Show aggregated stats
        cursor.execute("""
        SELECT topic, uncertainty, COUNT(*) as count, AVG(score) as avg_score
        FROM student_records 
        GROUP BY topic, uncertainty 
        ORDER BY topic, uncertainty
        """)
        
        print("\n📈 Aggregated Statistics:")
        print("Topic | Uncertainty | Count | Avg Score")
        print("-" * 50)
        for stat in cursor.fetchall():
            print(f"{stat[0]} | {stat[1]} | {stat[2]} | {stat[3]:.1f}")
            
    except Exception as e:
        print(f"❌ Error during ingestion: {e}")
        if 'conn' in locals():
            conn.rollback()
        sys.exit(1)
    finally:
        if 'conn' in locals():
            cursor.close()
            conn.close()
            print("\n🔒 Database connection closed")

if __name__ == "__main__":
    csv_file = "canvas_export.csv"
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
    
    if not os.path.exists(csv_file):
        print(f"❌ CSV file not found: {csv_file}")
        sys.exit(1)
    
    print("🚀 Starting K-12 LLM Tutor Data Ingest Pipeline")
    print("=" * 60)
    ingest_csv_data(csv_file)
    print("=" * 60)
    print("✅ Ingest pipeline completed successfully!")
