-- 1. Create a function to handle new user signups from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, name)
  VALUES (
    new.id::text, 
    new.email, 
    new.raw_user_meta_data->>'name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Enable RLS on all tables
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Staff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Booking" ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- User table
CREATE POLICY "Users can view own data" ON public."User"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON public."User"
  FOR UPDATE USING (auth.uid()::text = id);

-- Business table
CREATE POLICY "Businesses can be viewed by anyone" ON public."Business"
  FOR SELECT USING (true); -- Public needs to see business details to book

CREATE POLICY "Users can create their own business" ON public."Business"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own business" ON public."Business"
  FOR UPDATE USING (auth.uid()::text = "userId");

-- Staff table
CREATE POLICY "Staff can be viewed by anyone" ON public."Staff"
  FOR SELECT USING (true);

CREATE POLICY "Business owners can manage staff" ON public."Staff"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public."Business"
      WHERE public."Business".id = "businessId"
      AND public."Business"."userId" = auth.uid()::text
    )
  );

-- Service table
CREATE POLICY "Services can be viewed by anyone" ON public."Service"
  FOR SELECT USING (true);

CREATE POLICY "Business owners can manage services" ON public."Service"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public."Business"
      WHERE public."Business".id = "businessId"
      AND public."Business"."userId" = auth.uid()::text
    )
  );

-- Booking table
CREATE POLICY "Business owners can view bookings" ON public."Booking"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."Business"
      WHERE public."Business".id = "businessId"
      AND public."Business"."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Public can insert bookings" ON public."Booking"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Business owners can update bookings" ON public."Booking"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public."Business"
      WHERE public."Business".id = "businessId"
      AND public."Business"."userId" = auth.uid()::text
    )
  );
