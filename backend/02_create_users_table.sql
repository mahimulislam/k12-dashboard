CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In a real app, use bcrypt or similar for hashing
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial users for demonstration
-- Passwords are 'password' for all roles (INSECURE FOR DEMO ONLY)
INSERT INTO users (username, password_hash, role) VALUES
('teacher_user', 'password', 'teacher') ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password_hash, role) VALUES
('admin_user', 'password', 'administrator') ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password_hash, role) VALUES
('dpo_user', 'password', 'dpo') ON CONFLICT (username) DO NOTHING;
