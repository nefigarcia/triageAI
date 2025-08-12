-- Users table to store information about support agents
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url VARCHAR(255),
    team_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY team_id_idx (team_id)
);

-- Teams table to group users
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tickets table to store support tickets
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(255) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    status ENUM('open', 'in_progress', 'closed', 'escalated') NOT NULL DEFAULT 'open',
    urgency ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'low',
    category VARCHAR(255),
    assigned_to_user_id VARCHAR(255),
    assigned_to_team_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    KEY status_idx (status),
    KEY urgency_idx (urgency)
);

-- Ticket logs to track all actions performed on a ticket
CREATE TABLE IF NOT EXISTS ticket_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL,
    actor_type ENUM('ai', 'user') NOT NULL,
    actor_id VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Feedback table for human-in-the-loop corrections
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    is_correct BOOLEAN,
    corrected_intent VARCHAR(255),
    corrected_urgency ENUM('low', 'medium', 'high'),
    corrected_category VARCHAR(255),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed initial data for teams and users
INSERT IGNORE INTO teams (id, name) VALUES
('team-tech', 'Technical Support'),
('team-billing', 'Billing'),
('team-sales', 'Sales'),
('team-general', 'General Inquiries');

INSERT IGNORE INTO users (id, name, email, avatar_url, team_id) VALUES
('user-alex', 'Alex Johnson', 'alex@triageflow.com', 'https://i.pravatar.cc/150?u=alex', 'team-tech'),
('user-bob', 'Bob Williams', 'bob@triageflow.com', 'https://i.pravatar.cc/150?u=bob', 'team-tech'),
('user-charlie', 'Charlie Brown', 'charlie@triageflow.com', 'https://i.pravatar.cc/150?u=charlie', 'team-billing'),
('user-diana', 'Diana Prince', 'diana@triageflow.com', 'https://i.pravatar.cc/150?u=diana', 'team-sales');
