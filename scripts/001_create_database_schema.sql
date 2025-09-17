-- Create users profile table for extended user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  document_number TEXT, -- CPF or CNPJ
  document_type TEXT CHECK (document_type IN ('CPF', 'CNPJ')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for INPI consultation requests
CREATE TABLE IF NOT EXISTS public.inpi_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_term TEXT NOT NULL,
  search_type TEXT NOT NULL CHECK (search_type IN ('trademark', 'patent', 'design')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  results JSONB,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for registration processes
CREATE TABLE IF NOT EXISTS public.registration_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.inpi_consultations(id),
  process_type TEXT NOT NULL CHECK (process_type IN ('trademark', 'patent', 'design')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published')),
  inpi_process_number TEXT,
  priority_date DATE,
  publication_date DATE,
  documents JSONB DEFAULT '[]'::jsonb,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for billing and payments
CREATE TABLE IF NOT EXISTS public.billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.inpi_consultations(id),
  process_id UUID REFERENCES public.registration_processes(id),
  service_type TEXT NOT NULL CHECK (service_type IN ('consultation', 'registration', 'monitoring')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  invoice_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for process monitoring/tracking
CREATE TABLE IF NOT EXISTS public.process_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES public.registration_processes(id) ON DELETE CASCADE,
  status_change TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  notes TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inpi_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_monitoring ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for inpi_consultations
CREATE POLICY "consultations_select_own" ON public.inpi_consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "consultations_insert_own" ON public.inpi_consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "consultations_update_own" ON public.inpi_consultations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "consultations_delete_own" ON public.inpi_consultations FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for registration_processes
CREATE POLICY "processes_select_own" ON public.registration_processes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "processes_insert_own" ON public.registration_processes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "processes_update_own" ON public.registration_processes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "processes_delete_own" ON public.registration_processes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for billing_records
CREATE POLICY "billing_select_own" ON public.billing_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "billing_insert_own" ON public.billing_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "billing_update_own" ON public.billing_records FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for process_monitoring (users can only see monitoring for their own processes)
CREATE POLICY "monitoring_select_own" ON public.process_monitoring FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.registration_processes 
  WHERE id = process_monitoring.process_id AND user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inpi_consultations_user_id ON public.inpi_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_inpi_consultations_status ON public.inpi_consultations(status);
CREATE INDEX IF NOT EXISTS idx_registration_processes_user_id ON public.registration_processes(user_id);
CREATE INDEX IF NOT EXISTS idx_registration_processes_status ON public.registration_processes(status);
CREATE INDEX IF NOT EXISTS idx_billing_records_user_id ON public.billing_records(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_status ON public.billing_records(status);
CREATE INDEX IF NOT EXISTS idx_process_monitoring_process_id ON public.process_monitoring(process_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.inpi_consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON public.registration_processes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON public.billing_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
