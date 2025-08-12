CREATE TABLE teams (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    team_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE tickets (
    id VARCHAR(255) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    status ENUM('open', 'in_progress', 'closed', 'escalated') DEFAULT 'open',
    urgency ENUM('low', 'medium', 'high') DEFAULT 'low',
    category VARCHAR(255),
    assigned_to_id VARCHAR(255),
    team_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE ticket_logs (
    id VARCHAR(255) PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor ENUM('AI', 'User') NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    is_correct BOOLEAN,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(255),
    details JSON,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Pre-populate teams and users from data.ts
INSERT INTO teams (id, name) VALUES
('team-tech', 'Technical Support'),
('team-billing', 'Billing'),
('team-sales', 'Sales'),
('team-general', 'General Inquiries');

INSERT INTO users (id, name, email, avatar_url, team_id) VALUES
('user-alex', 'Alex Johnson', 'alex@triageflow.com', 'https://i.pravatar.cc/150?u=alex', 'team-tech'),
('user-bob', 'Bob Williams', 'bob@triageflow.com', 'https://i.pravatar.cc/150?u=bob', 'team-tech'),
('user-charlie', 'Charlie Brown', 'charlie@triageflow.com', 'https://i.pravatar.cc/150?u=charlie', 'team-billing'),
('user-diana', 'Diana Prince', 'diana@triageflow.com', 'https://i.pravatar.cc/150?u=diana', 'team-sales');
