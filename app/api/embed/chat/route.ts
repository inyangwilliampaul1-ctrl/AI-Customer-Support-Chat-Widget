import { createClient } from '@/lib/supabase/client'; // Use client for public access (or createServerClient with service role if needed, but standard client is fine for public reads if policies allow, but wait... RLS.)
// ACTUALLY: The 'businesses' table might not be readable by 'anon' users efficiently without RLS policies allowing it by API key. 
// BUT: We are on the server. We can use the SERVICE_ROLE key to bypass RLS for this specific lookup, OR just use standard client and ensure RLS allows reading business by API key.
// BETTER APPROACH: Use Service Role client here to securely lookup business by API Key, since we shouldn't expose a "list all businesses" policy to anon.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Supabase Admin client to bypass RLS for API Key lookup
const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback to anon if service role missing, but RLS will block.
    // NOTE: We need SUPABASE_SERVICE_ROLE_KEY in env for this to work securely if RLS is strict.
    // For now, assuming RLS allows anon read of business by ID? No. User_id.
    // I will use ANON key but I might need to adjust RLS.
    // actually, let's try to query with anon key. If it fails, I'll ask user for Service Key or adjust RLS.
    // Wait, "businesses" table usually has "auth.uid() = user_id". Anon has no uid.
    // So Anon cannot find the business. 
    // I MUST use Service Role or a Postgres Function `security definer`.
    // Let's use a simple Postgres Function approach? Or easier: Service Role Key.
    // Check env... I only have ANON_KEY.
    // OK, I will create a robust "rpc" function to lookup business by API Key? 
    // Or I'll just Ask User for Service Key? No, that's friction.
    // Let's create a Postgres function "get_business_by_api_key" which is SECURITY DEFINER.
);

// Actually, I can just use the provided standard createClient if I add a policy.
// "Allow anon access to businesses where api_key = X"? No, RLS policies are row-based.
// Policy: "Everyone can read business if they know the api_key"? Logic circular.
// Postgres Function is the clean way.

/*
// SQL TO RUN:
CREATE OR REPLACE FUNCTION get_business_by_api_key(api_key_input text)
RETURNS TABLE (id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT id, name FROM businesses WHERE api_key = api_key_input;
END;
$$;
*/

// Let's try to implement the API route assuming I'll add that function next.

export async function POST(req: Request) {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
        return NextResponse.json({}, { headers });
    }

    try {
        const { apiKey, question } = await req.json();

        if (!apiKey || !question) {
            return NextResponse.json({ error: 'Missing apiKey or question' }, { status: 400, headers });
        }

        // Initialize Supabase (Anon)
        // We will call the RPC function we are about to create.
        // This is safe because the RPC function controls the query.
        const supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1. Validate API Key & Get Business
        const { data: businessData, error: businessError } = await supabase
            .rpc('get_business_by_api_key', { api_key_input: apiKey })
            .single();

        const business = businessData as { name: string } | null;

        if (businessError || !business) {
            return NextResponse.json({ error: 'Invalid API Key' }, { status: 401, headers });
        }

        // 2. Get FAQs
        // We also need to be able to read FAQs for this business.
        // Simple RLS policy: "Allow read access to faqs if business_id matches..." hard to verify API key in RLS for faqs.
        // Easier: Another RPC or just make faqs public?
        // Let's make FAQs public-readable for now? Or specific check.
        // Safest: Use the same RPC approach or a specialized function.
        // Let's Fetch FAQs via RPC too to keep it strictly controlled.

        // Actually, for FAQs, "Public Read" is usually fine if you have the business ID.
        // But we want to prevent scraping?
        // Let's create `get_faqs_by_api_key` RPC.

        const { data: faqs, error: faqError } = await supabase
            .rpc('get_faqs_by_api_key', { api_key_input: apiKey });

        if (faqError) {
            console.error("FAQ Error", faqError);
            // Contiue with empty FAQs if error (or handle)
        }

        const contextText = faqs?.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || "No FAQs available.";

        const systemPrompt = `You are a helpful customer support AI for ${business.name}.
Use the following Frequently Asked Questions (FAQs) to answer the user's question.
If the answer is not in the FAQs, politely say you don't know and advise them to contact support.
Do not make up facts not present in the FAQs.

FAQs:
${contextText}
`;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question },
            ],
            temperature: 0.5,
        });

        const answer = completion.choices[0].message.content;

        return NextResponse.json({ answer }, { headers });

    } catch (error: any) {
        console.error('Embed Chat error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500, headers });
    }
}
