-- Function to get a business by API Key (Bypasses RLS)
CREATE OR REPLACE FUNCTION get_business_by_api_key(api_key_input text)
RETURNS TABLE (id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT b.id, b.name FROM businesses b WHERE b.api_key = api_key_input;
END;
$$;

-- Function to get FAQs by Business API Key (Bypasses RLS)
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
