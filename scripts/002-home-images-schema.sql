-- Create home_images table for homepage slider
CREATE TABLE IF NOT EXISTS home_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_home_images_order ON home_images(display_order, is_active);

-- Insert some sample data (optional)
INSERT INTO home_images (title, description, image_url, display_order, is_active) VALUES
('Welcome to Our Community', 'Celebrating our rich heritage and traditions', '/placeholder.svg?height=400&width=800', 1, true),
('Cultural Events', 'Join us in our vibrant cultural celebrations', '/placeholder.svg?height=400&width=800', 2, true),
('Community Support', 'Supporting each other through all of life''s moments', '/placeholder.svg?height=400&width=800', 3, true),
('Youth Programs', 'Engaging the next generation in our traditions', '/placeholder.svg?height=400&width=800', 4, true),
('Business Network', 'Connecting our community through business partnerships', '/placeholder.svg?height=400&width=800', 5, true)
ON CONFLICT DO NOTHING;
