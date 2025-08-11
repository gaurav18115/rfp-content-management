-- Updated RFP table schema to match the form fields
-- Run this to update your existing rfps table

-- Add missing columns to the rfps table
ALTER TABLE public.rfps 
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS additional_information TEXT,
ADD COLUMN IF NOT EXISTS attachments TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update the existing table structure to match the form
-- This ensures all form fields can be stored
COMMENT ON TABLE public.rfps IS 'Updated RFP table with all form fields';

-- Drop existing constraints if they exist (to avoid conflicts)
DO $$ 
BEGIN
    -- Drop priority constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_priority' AND table_name = 'rfps') THEN
        ALTER TABLE public.rfps DROP CONSTRAINT check_priority;
    END IF;
    
    -- Drop category constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_category' AND table_name = 'rfps') THEN
        ALTER TABLE public.rfps DROP CONSTRAINT check_category;
    END IF;
END $$;

-- Add constraints for the new fields
ALTER TABLE public.rfps 
ADD CONSTRAINT check_priority 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE public.rfps 
ADD CONSTRAINT check_category 
CHECK (category IN ('technology', 'marketing', 'design', 'consulting', 'manufacturing', 'services', 'other'));

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_rfps_company ON public.rfps(company);
CREATE INDEX IF NOT EXISTS idx_rfps_category ON public.rfps(category);
CREATE INDEX IF NOT EXISTS idx_rfps_priority ON public.rfps(priority); 