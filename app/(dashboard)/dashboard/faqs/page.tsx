import { createClient } from "@/lib/supabase/server";
import { createFAQ, deleteFAQ } from "./actions";
import { PlusCircle, Trash2, HelpCircle } from "lucide-react";

export default async function FAQsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get business logic could be abstracted, but for now inline is fine
    const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user?.id)
        .single();

    let faqs: any[] = [];

    if (business) {
        const result = await supabase
            .from("faqs")
            .select("*")
            .eq("business_id", business.id)
            .order("created_at", { ascending: false });
        faqs = result.data || [];
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
                    <p className="mt-2 text-gray-600">
                        Create questions and answers for your AI chatbot.
                    </p>
                </div>
            </div>

            {!business ? (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <p className="text-yellow-800">Please create a business profile first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-blue-600" />
                                Add New FAQ
                            </h3>
                            <form action={createFAQ} className="space-y-4">
                                <div>
                                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
                                    <input
                                        id="question"
                                        name="question"
                                        type="text"
                                        required
                                        placeholder="e.g. What are your hours?"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                                    <textarea
                                        id="answer"
                                        name="answer"
                                        rows={4}
                                        required
                                        placeholder="e.g. We are open 9am-5pm..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-gray-900"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add FAQ
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {faqs.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                                    <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new question.</p>
                                </div>
                            ) : (
                                faqs.map((faq) => (
                                    <div key={faq.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div className="pr-4">
                                                <h4 className="text-base font-semibold text-gray-900">{faq.question}</h4>
                                                <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
                                            </div>
                                            <form action={deleteFAQ}>
                                                <input type="hidden" name="id" value={faq.id} />
                                                <button type="submit" className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
