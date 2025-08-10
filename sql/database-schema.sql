-- Database Schema for RFP Content Management System
-- This file contains all the SQL commands needed to set up the database

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create rfps table
CREATE TABLE IF NOT EXISTS public.rfps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  budget_range TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft', 'published', 'closed', 'awarded')),
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create rfp_responses table
CREATE TABLE IF NOT EXISTS public.rfp_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rfp_id UUID NOT NULL REFERENCES public.rfps(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.user_profiles(id),
  proposal TEXT NOT NULL,
  budget DECIMAL(12,2),
  timeline TEXT,
  experience TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' 
    CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.user_profiles(id),
  rejection_reason TEXT,
  
  -- Ensure one response per supplier per RFP
  UNIQUE(rfp_id, supplier_id)
);

-- 4. Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.user_profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Polymorphic relationship
  entity_type TEXT NOT NULL CHECK (entity_type IN ('rfp', 'response', 'profile')),
  entity_id UUID NOT NULL,
  
  -- Metadata
  description TEXT,
  tags TEXT[]
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rfps_status ON public.rfps(status);
CREATE INDEX IF NOT EXISTS idx_rfps_created_by ON public.rfps(created_by);
CREATE INDEX IF NOT EXISTS idx_rfps_deadline ON public.rfps(deadline);

CREATE INDEX IF NOT EXISTS idx_rfp_responses_rfp_id ON public.rfp_responses(rfp_id);
CREATE INDEX IF NOT EXISTS idx_rfp_responses_supplier_id ON public.rfp_responses(supplier_id);
CREATE INDEX IF NOT EXISTS idx_rfp_responses_status ON public.rfp_responses(status);

CREATE INDEX IF NOT EXISTS idx_documents_entity ON public.documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 8. Create RLS Policies for rfps
CREATE POLICY "Anyone can view published RFPs" ON public.rfps
  FOR SELECT USING (status = 'published' OR auth.uid() = created_by);

CREATE POLICY "Buyers can create RFPs" ON public.rfps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'buyer'
    )
  );

CREATE POLICY "Buyers can update their own RFPs" ON public.rfps
  FOR UPDATE USING (
    auth.uid() = created_by AND status = 'draft'
  );

-- 9. Create RLS Policies for rfp_responses
CREATE POLICY "Suppliers can view their own responses" ON public.rfp_responses
  FOR SELECT USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can view responses to their RFPs" ON public.rfp_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rfps 
      WHERE id = rfp_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Suppliers can create responses to published RFPs" ON public.rfp_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rfps 
      WHERE id = rfp_id AND status = 'published'
    ) AND
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'supplier'
    )
  );

CREATE POLICY "Buyers can update responses to their RFPs" ON public.rfp_responses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.rfps 
      WHERE id = rfp_id AND created_by = auth.uid()
    )
  );

-- 10. Create RLS Policies for documents
CREATE POLICY "Users can view documents they uploaded" ON public.documents
  FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can view documents related to accessible entities" ON public.documents
  FOR SELECT USING (
    -- RFP documents: accessible if RFP is published or user is creator
    (entity_type = 'rfp' AND EXISTS (
      SELECT 1 FROM public.rfps 
      WHERE id = entity_id AND (status = 'published' OR created_by = auth.uid())
    )) OR
    -- Response documents: accessible if user is supplier or RFP creator
    (entity_type = 'response' AND EXISTS (
      SELECT 1 FROM public.rfp_responses r 
      JOIN public.rfps rf ON r.rfp_id = rf.id
      WHERE r.id = entity_id AND (r.supplier_id = auth.uid() OR rf.created_by = auth.uid())
    ))
  );

CREATE POLICY "Users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- 11. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers for updated_at
CREATE TRIGGER update_rfps_updated_at 
    BEFORE UPDATE ON public.rfps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Create function to publish RFP
CREATE OR REPLACE FUNCTION publish_rfp(rfp_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.rfps 
    SET status = 'published', published_at = NOW()
    WHERE id = rfp_uuid 
    AND created_by = auth.uid() 
    AND status = 'draft';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to close RFP
CREATE OR REPLACE FUNCTION close_rfp(rfp_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.rfps 
    SET status = 'closed', closed_at = NOW()
    WHERE id = rfp_uuid 
    AND created_by = auth.uid() 
    AND status = 'published';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer') -- Extract role from metadata, default to 'buyer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 17. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.rfps TO anon, authenticated;
GRANT ALL ON public.rfp_responses TO anon, authenticated;
GRANT ALL ON public.documents TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 