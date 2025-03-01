-- Insert service categories if they don't exist
INSERT IGNORE INTO service_category (name, created_at) VALUES 
('Điều Trị Da', NOW()),
('Chăm Sóc Tóc', NOW()),
('Chăm Sóc Móng', NOW()),
('Massage & Spa', NOW()); 