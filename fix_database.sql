-- 1. Add api_key to businesses if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'api_key') THEN
        ALTER TABLE businesses ADD COLUMN api_key text DEFAULT gen_random_uuid()::text NOT NULL;
        ALTER TABLE businesses ADD CONSTRAINT businesses_api_key_key UNIQUE (api_key);
        CREATE INDEX businesses_api_key_idx ON businesses (api_key);
    END IF;
END $$;

-- 2. Function to get a business by API Key (Public Access)
CREATE OR REPLACE FUNCTION get_business_by_api_key(api_key_input text)
RETURNS TABLE (id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT b.id, b.name FROM businesses b WHERE b.api_key = api_key_input;
END;
$$;

-- 3. Function to get FAQs by Business API Key (Public Access)
CREATE OR REPLACE FUNCTION get_faqs_by_api_key(api_key_input text)
RETURNS TABLE (question text, answer text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT f.question, f.answer 
  FROM faqs f
  JOIN businesses b ON b.id = f.business_id
  WHERE b.api_key = api_key_input
  ORDER BY f.created_at DESC;
END;
$$;
