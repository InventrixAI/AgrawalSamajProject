CREATE TABLE scrolling_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
