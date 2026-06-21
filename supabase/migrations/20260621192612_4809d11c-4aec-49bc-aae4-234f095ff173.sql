
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Footprints
CREATE TABLE public.footprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- transport (km / week, flights / year)
  car_km_week NUMERIC NOT NULL DEFAULT 0,
  transit_km_week NUMERIC NOT NULL DEFAULT 0,
  flights_year NUMERIC NOT NULL DEFAULT 0,
  -- energy (kWh / month, hours/day AC)
  electricity_kwh_month NUMERIC NOT NULL DEFAULT 0,
  ac_hours_day NUMERIC NOT NULL DEFAULT 0,
  -- food: 'vegan' | 'vegetarian' | 'omnivore' | 'heavy_meat'
  diet TEXT NOT NULL DEFAULT 'omnivore',
  -- lifestyle 1-5
  shopping_level INT NOT NULL DEFAULT 3,
  recycling_level INT NOT NULL DEFAULT 3,
  -- water L/day
  water_liters_day NUMERIC NOT NULL DEFAULT 150,
  -- computed (kg CO2/year per category)
  co2_transport NUMERIC NOT NULL DEFAULT 0,
  co2_energy NUMERIC NOT NULL DEFAULT 0,
  co2_food NUMERIC NOT NULL DEFAULT 0,
  co2_waste NUMERIC NOT NULL DEFAULT 0,
  co2_water NUMERIC NOT NULL DEFAULT 0,
  co2_total NUMERIC NOT NULL DEFAULT 0,
  eco_score INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX footprints_user_created_idx ON public.footprints(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footprints TO authenticated;
GRANT ALL ON public.footprints TO service_role;
ALTER TABLE public.footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own footprints" ON public.footprints FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_reduction_pct INT NOT NULL DEFAULT 10,
  progress_pct INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX goals_user_idx ON public.goals(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own goals" ON public.goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER footprints_touch BEFORE UPDATE ON public.footprints FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER goals_touch BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
