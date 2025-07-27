#!/usr/bin/env python3
"""
RBAC API Proof of Concept for K-12 LLM Tutor Dashboard
Demonstrates role-based access control with different data views
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from typing import Optional, List, Dict, Any
import os
import json
from datetime import datetime
from http import HTTPStatus
import traceback

app = FastAPI(title="K-12 LLM Tutor RBAC API", version="1.0.0")

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'edtech_dashboard'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'port': os.getenv('DB_PORT', '5432')
}

# Mock user roles and permissions (in production, this would come from JWT/OAuth)
# THESE MUST MATCH THE TOKENS SET IN lib/actions.ts
MOCK_USERS = {
    "teacher_123": {
        "role": "teacher",
        "permissions": ["view_class_data", "view_student_progress", "modify_settings"],
        "class_ids": ["CLASS_A", "CLASS_B"]
    },
    "admin_001": {
        "role": "administrator",
        "permissions": ["view_all_data", "modify_settings", "export_data", "manage_users", "view_audit_logs", "manage_privacy"],
        "class_ids": ["*"]  # All classes
    },
    "dpo_001": {
        "role": "dpo",
        "permissions": ["view_audit_logs", "export_data", "manage_privacy"],
        "class_ids": ["*"]
    },
    "teacher_456": { # This was an example, ensure it's not causing confusion if not used
        "role": "teacher",
        "permissions": ["view_class_data", "view_student_progress"],
        "class_ids": ["CLASS_C"]
    }
}

def get_db_connection():
    """Get database connection"""
    return psycopg2.connect(**DB_CONFIG)

# Modified to always return admin user for full access
def get_current_user(authorization: Optional[str] = Header(None)):
    """Always return admin user for full access (DEMO ONLY)"""
    admin_user_id = "admin_001"
    user_info = MOCK_USERS[admin_user_id].copy()
    user_info["user_id"] = admin_user_id
    print(f"DEBUG: Granting full access to user: {user_info['user_id']} ({user_info['role']})")
    return user_info

# Removed check_permission function as it's no longer needed with full access granted

@app.get("/")
async def root():
    return {"message": "K-12 LLM Tutor RBAC API", "version": "1.0.0"}

@app.get("/api/class-radar")
async def get_class_radar(user: Dict = Depends(get_current_user)):
    """Get class radar data with RBAC filtering"""
    # No explicit permission check needed here, as get_current_user always returns admin
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Always fetch detailed data since access is granted
        query = """
        SELECT topic, concept, uncertainty, COUNT(*) as student_count,
               AVG(score) as avg_score, MIN(score) as min_score, MAX(score) as max_score
        FROM student_records
        GROUP BY topic, concept, uncertainty
        ORDER BY topic, concept
        """

        cursor.execute(query)
        results = cursor.fetchall()

        radar_data = []
        for row in results:
            item = {
                "topic": row[0],
                "concept": row[1],
                "uncertainty": row[2],
                "students": row[3],
                "avg_score": round(row[4], 1) if row[4] else 0,
                "min_score": row[5],
                "max_score": row[6]
            }
            radar_data.append(item)

        return {
            "data": radar_data,
            "user_role": user["role"],
            "permissions": user["permissions"],
            "timestamp": datetime.now().isoformat()
        }

    except psycopg2.Error as e:
        print(f"ERROR in get_class_radar (PostgreSQL error): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(f"ERROR in get_class_radar (unexpected error): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        if 'conn' in locals():
            cursor.close()
            conn.close()

@app.get("/api/student/{pseudonym}")
async def get_student_data(pseudonym: str, user: Dict = Depends(get_current_user)):
    """Get individual student data with RBAC filtering and mastery summary"""
    # No explicit permission check needed here, as get_current_user always returns admin
    print(f"DEBUG: Accessing student data for pseudonym: {pseudonym}")
    print(f"DEBUG: User role: {user['role']}, Permissions: {user['permissions']}")

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Always fetch all details
        timeline_query = """
        SELECT pseudonym, topic, concept, score, uncertainty, interaction_type, timestamp, consent_provenance, rationale_details
        FROM student_records
        WHERE pseudonym = %s
        ORDER BY timestamp DESC
        """

        cursor.execute(timeline_query, (pseudonym,))
        timeline_results = cursor.fetchall()

        if not timeline_results:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Student not found or no interactions recorded")

        student_timeline = []
        for row in timeline_results:
            item = {
                "pseudonym": row[0],
                "topic": row[1],
                "concept": row[2],
                "score": row[3],
                "uncertainty": row[4],
                "interaction_type": row[5],
                "timestamp": row[6].isoformat() if row[6] else None,
                "consent_provenance": row[7],
                "rationale": row[8]
            }
            student_timeline.append(item)

        mastery_query = """
        SELECT topic, AVG(score) as avg_score, COUNT(*) as interaction_count
        FROM student_records
        WHERE pseudonym = %s
        GROUP BY topic
        ORDER BY topic
        """
        cursor.execute(mastery_query, (pseudonym,))
        mastery_results = cursor.fetchall()

        mastery_summary = []
        for row in mastery_results:
            mastery_summary.append({
                "topic": row[0],
                "average_score": round(row[1], 1),
                "interaction_count": row[2]
            })

        return {
            "student_name": f"Student {pseudonym[:8]}...",
            "student_id": pseudonym,
            "timeline_events": student_timeline,
            "mastery_summary": mastery_summary,
            "user_role": user["role"],
            "access_level": "full" # Always return full access level
        }

    except HTTPException:
        raise
    except psycopg2.Error as e:
        print(f"ERROR in get_student_data (PostgreSQL error): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(f"ERROR in get_student_data (unexpected error): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        if conn:
            cursor.close()
            conn.close()

@app.get("/api/audit-logs")
async def get_audit_logs(user: Dict = Depends(get_current_user)):
  """Get audit logs - DPO and Admin only"""
  # No explicit permission check needed here, as get_current_user always returns admin
  try:
      conn = get_db_connection()
      cursor = conn.cursor()

      query = """
      SELECT id, timestamp, user_id, role, action_type, details
      FROM audit_logs
      ORDER BY timestamp DESC
      LIMIT 50
      """
      cursor.execute(query)
      results = cursor.fetchall()

      audit_logs_data = []
      for row in results:
          audit_logs_data.append({
              "id": row[0],
              "timestamp": row[1].isoformat() if row[1] else None,
              "userId": row[2],
              "role": row[3],
              "action": row[4],
              "details": row[5]
          })

      return {
          "audit_logs": audit_logs_data,
          "user_role": user["role"],
          "total_logs": len(audit_logs_data)
      }
  except psycopg2.Error as e:
      print(f"ERROR in get_audit_logs (PostgreSQL error): {e}")
      traceback.print_exc()
      raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")
  except Exception as e:
      print(f"ERROR in get_audit_logs (unexpected error): {e}")
      traceback.print_exc()
      raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")
  finally:
      if 'conn' in locals():
          cursor.close()
          conn.close()

@app.get("/api/user-info")
async def get_user_info(user: Dict = Depends(get_current_user)):
  """Get current user information"""
  return {
      "role": user["role"],
      "permissions": user["permissions"],
      "class_ids": user["class_ids"]
  }

@app.post("/api/log-action")
async def log_action(log_entry: Dict[str, Any], user: Dict = Depends(get_current_user)):
  """Log an action to the audit trail (e.g., override changes)"""
  # No explicit permission check needed here, as get_current_user always returns admin
  conn = None # Initialize conn to None
  try:
      conn = get_db_connection()
      cursor = conn.cursor()

      insert_query = """
      INSERT INTO audit_logs (user_id, role, action_type, details)
      VALUES (%s, %s, %s, %s::jsonb)
      """

      cursor.execute(insert_query, (
          user.get("user_id", "unknown"),
          user["role"],
          log_entry.get("action_type", "UNKNOWN_ACTION"),
          json.dumps(log_entry.get("details", {}))
      ))
      conn.commit()
      return {"status": "success", "message": "Action logged successfully"}
  except psycopg2.Error as e:
      if conn: conn.rollback()
      print(f"ERROR in log_action (PostgreSQL error): {e}")
      traceback.print_exc()
      raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")
  except Exception as e:
      if conn: conn.rollback()
      print(f"ERROR in log_action (unexpected error): {e}")
      traceback.print_exc()
      raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")
  finally:
      if conn:
          cursor.close()
          conn.close()

if __name__ == "__main__":
  import uvicorn
  print("🚀 Starting RBAC API Server")
  print("📋 Available test users:")
  for user_id, user_info in MOCK_USERS.items():
      print(f"  - {user_id} ({user_info['role']})")
  print("\n🔗 API Documentation: http://localhost:8000/docs")
  uvicorn.run(app, host="0.0.0.0", port=8000)
