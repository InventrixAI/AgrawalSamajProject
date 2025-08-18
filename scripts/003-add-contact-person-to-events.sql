-- Migration: Add Contact Person Details to Events Table
-- Description: Add contact person name, address, and mobile number columns to the events table
-- Date: 2025-08-18

-- Add contact person columns to events table
ALTER TABLE events 
ADD COLUMN contact_person_name TEXT,
ADD COLUMN contact_person_address TEXT,
ADD COLUMN contact_person_mobile TEXT;

-- Add comment for documentation
COMMENT ON COLUMN events.contact_person_name IS 'Name of the contact person for the event';
COMMENT ON COLUMN events.contact_person_address IS 'Address of the contact person for the event';
COMMENT ON COLUMN events.contact_person_mobile IS 'Mobile number of the contact person for the event';