-- First, check if service categories exist and insert if they don't
INSERT INTO service_category (name, created_at)
SELECT 'Điều Trị Da', NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Điều Trị Da');

INSERT INTO service_category (name, created_at)
SELECT 'Chăm Sóc Tóc', NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Chăm Sóc Tóc');

INSERT INTO service_category (name, created_at)
SELECT 'Chăm Sóc Móng', NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Chăm Sóc Móng');

INSERT INTO service_category (name, created_at)
SELECT 'Massage & Spa', NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Massage & Spa');

-- Get the category IDs
SET @skin_category_id = (SELECT id FROM service_category WHERE name = 'Điều Trị Da' LIMIT 1);
SET @hair_category_id = (SELECT id FROM service_category WHERE name = 'Chăm Sóc Tóc' LIMIT 1);
SET @nail_category_id = (SELECT id FROM service_category WHERE name = 'Chăm Sóc Móng' LIMIT 1);
SET @massage_category_id = (SELECT id FROM service_category WHERE name = 'Massage & Spa' LIMIT 1);

-- Then, insert services if they don't exist
-- Sample service 1 (Chăm Sóc Da Mặt Cơ Bản)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Chăm Sóc Da Mặt Cơ Bản', 250000, 30, 1, 1, @skin_category_id, NOW(), 'Làm sạch và dưỡng ẩm da mặt'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Chăm Sóc Da Mặt Cơ Bản');

-- Sample service 2 (Chăm Sóc Da Chuyên Sâu)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Chăm Sóc Da Chuyên Sâu', 350000, 70, 1, 1, @skin_category_id, NOW(), 'Cải thiện kết cấu da và cấp ẩm sâu'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Chăm Sóc Da Chuyên Sâu');

-- Sample service 3 (Trị Mụn Chuyên Nghiệp)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Trị Mụn Chuyên Nghiệp', 450000, 60, 1, 1, @skin_category_id, NOW(), 'Điều trị mụn hiệu quả'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Trị Mụn Chuyên Nghiệp');

-- Sample service 4 (Cắt Tóc Nữ)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Cắt Tóc Nữ', 200000, 45, 1, 1, @hair_category_id, NOW(), 'Tạo kiểu tóc phù hợp với khuôn mặt'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Cắt Tóc Nữ');

-- Sample service 5 (Nhuộm Tóc)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Nhuộm Tóc', 500000, 120, 1, 1, @hair_category_id, NOW(), 'Màu tóc thời trang và bền màu'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Nhuộm Tóc');

-- Sample service 6 (Làm Móng Gel)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Làm Móng Gel', 300000, 60, 1, 1, @nail_category_id, NOW(), 'Móng gel bền đẹp và tự nhiên'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Làm Móng Gel');

-- Sample service 7 (Massage Toàn Thân)
INSERT INTO services (name, price, duration, session, active, service_category_id, created_at, sub_title)
SELECT 'Massage Toàn Thân', 400000, 90, 1, 1, @massage_category_id, NOW(), 'Thư giãn và giảm căng thẳng'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Massage Toàn Thân'); 