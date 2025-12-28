import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user's business
        const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Get FAQs
        const { data: faqs } = await supabase
            .from('faqs')
            .select('question, answer')
            .eq('business_id', business.id);

        const { question } = await req.json();

        if (!question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        // Prepare Context
        const contextText = faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || "No FAQs available.";

        const systemPrompt = `You are a helpful customer support AI for a specific business.
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
            model: "gpt-4o-mini", // Cost effective and fast
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question },
            ],
            temperature: 0.5,
        });

        const answer = completion.choices[0].message.content;

        return NextResponse.json({ answer });

    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
