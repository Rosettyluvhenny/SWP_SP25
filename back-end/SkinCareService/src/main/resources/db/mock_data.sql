-- Clear existing data
DELETE FROM services;
DELETE FROM service_category;

-- Insert service categories with explicit IDs
INSERT INTO service_category (id, name, active) VALUES
(1, 'Facial Treatments', true),
(2, 'Body Treatments', true),
(3, 'Skin Care Packages', true),
(4, 'Anti-Aging Treatments', true),
(5, 'Acne Treatments', true),
(6, 'Discontinued Treatments', false),
(7, 'Legacy Services', false);

-- Insert services with explicit service_category_id references
INSERT INTO services (id, name, service_category_id, description, price, duration, session, img, active) VALUES
(1, 'Deep Cleansing Facial', 1, 'A thorough cleansing treatment that removes impurities and refreshes your skin', 89.99, 60, 1, 'service_1', true),
(2, 'Hydrating Facial', 1, 'Intensive hydration treatment for dry and dehydrated skin', 99.99, 75, 1, 'service_2', true),
(3, 'Swedish Massage', 2, 'Full body relaxation massage with medium pressure', 129.99, 90, 1, 'service_3', true),
(4, 'Premium Skin Care Package', 3, 'Complete skin care treatment including facial, massage, and mask', 299.99, 120, 3, 'service_4', true),
(5, 'Anti-Aging Facial', 4, 'Advanced treatment to reduce fine lines and wrinkles', 149.99, 90, 1, 'service_5', true),
(6, 'Acne Control Treatment', 5, 'Specialized treatment for acne-prone skin with deep cleansing', 119.99, 60, 1, 'service_6', true),
(7, 'Hot Stone Massage', 2, 'Relaxing massage using heated stones', 159.99, 90, 1, 'service_7', true),
(8, 'Gold Facial', 1, 'Luxury facial treatment with 24k gold elements', 199.99, 90, 1, 'service_8', true),
(9, 'Teen Acne Treatment', 5, 'Gentle acne treatment designed for teenage skin', 79.99, 45, 1, 'service_9', true),
(10, 'Ultimate Spa Package', 3, 'Complete spa day including multiple treatments', 399.99, 180, 5, 'service_10', true),
(11, 'Express Facial', 1, 'Quick but effective facial treatment for busy individuals', 59.99, 30, 1, 'service_11', true),
(12, 'Anti-Aging Eye Treatment', 4, 'Focused treatment for the delicate eye area', 69.99, 30, 1, 'service_12', true),
(13, 'Back Facial', 2, 'Deep cleansing treatment for the back area', 109.99, 60, 1, 'service_13', true),
(14, 'Brightening Facial', 1, 'Treatment to improve skin tone and radiance', 129.99, 75, 1, 'service_14', true),
(15, 'Seasonal Skin Care Package', 3, 'Customized package based on seasonal skin needs', 249.99, 120, 3, 'service_15', true),
(16, 'Discontinued Package', 3, 'Old package no longer offered', 199.99, 90, 2, 'service_16', false),
(17, 'Legacy Treatment', 4, 'Previous version of anti-aging treatment', 139.99, 60, 1, 'service_17', false),
(18, 'Old Massage Style', 2, 'Traditional massage technique no longer offered', 99.99, 60, 1, 'service_18', false);

-- Reset sequences
DBCC CHECKIDENT ('services', RESEED, 0);
DBCC CHECKIDENT ('service_category', RESEED, 0); 