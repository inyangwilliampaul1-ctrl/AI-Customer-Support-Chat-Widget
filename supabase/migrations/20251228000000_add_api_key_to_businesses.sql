-- Add api_key column to businesses table
ALTER TABLE businesses 
ADD COLUMN api_key text DEFAULT gen_random_uuid()::text NOT NULL;

-- Make it unique to ensure secure lookup
ALTER TABLE businesses 
ADD CONSTRAINT businesses_api_key_key UNIQUE (api_key);

-- Add index for faster lookup during chat requests
CREATE INDEX businesses_api_key_idx ON businesses (api_key);
