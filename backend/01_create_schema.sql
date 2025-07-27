CREATE TABLE IF NOT EXISTS student_records (
    id SERIAL PRIMARY KEY,
    pseudonym VARCHAR(64) NOT NULL,  -- SHA-256 hash of student_id + salt
    topic VARCHAR(100) NOT NULL,
    concept VARCHAR(200) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    uncertainty VARCHAR(20) CHECK (uncertainty IN ('low', 'medium', 'high')),
    interaction_type VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consent_provenance TEXT NOT NULL,
    rationale_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salt_store (
    id SERIAL PRIMARY KEY,
    salt_value BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    details JSONB
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_records_pseudonym ON student_records(pseudonym);
CREATE INDEX IF NOT EXISTS idx_student_records_topic ON student_records(topic);
CREATE INDEX IF NOT EXISTS idx_student_records_timestamp ON student_records(timestamp);

-- Insert initial salt (in production, this would be managed more securely)
INSERT INTO salt_store (salt_value, is_active) 
VALUES (decode('a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', 'hex'), TRUE)
ON CONFLICT DO NOTHING;
