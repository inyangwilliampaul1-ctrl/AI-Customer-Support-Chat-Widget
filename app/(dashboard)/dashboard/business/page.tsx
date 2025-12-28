import { createClient } from "@/lib/supabase/server";
import { saveBusiness } from "./actions";
import { Building2, Calendar, Pencil } from "lucide-react";

export default async function BusinessPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch only the user's business
    const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user?.id)
        .limit(1);

    const business = businesses?.[0];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Business</h1>
                <p className="mt-2 text-gray-600">
                    Manage your business identity and settings.
                </p>
            </div>

            <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-500" />
                        Business Details
                    </h3>
                    {business && (
                        <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            Active
                        </span>
                    )}
                </div>

                <div className="p-6">
                    {business ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Business Name</label>
                                    <div className="mt-1 text-lg font-semibold text-gray-900 flex items-center justify-between group">
                                        {business.name}
                                        {/* Simple toggle for edit could be client-side state, 
                           but for server-component purity we can use a small form or different UI pattern. 
                           Here we'll keep it simple as a display, and a separate 'Update' form below or valid edit UI.
                        */}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                                    <div className="mt-1 text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(business.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Embed Configuration</h4>
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your API Key</label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 block w-full rounded-md border-gray-300 bg-white shadow-sm sm:text-sm p-2 border text-gray-900 font-mono">
                                            {business.api_key}
                                        </code>
                                        <button
                                            // Client-side clipboard copy would go here, simpler for now
                                            className="hidden px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Use this key to integrate the chat widget on your website.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-4">Update Business Name</h4>
                                <form action={saveBusiness} className="flex gap-4 items-end">
                                    <input type="hidden" name="id" value={business.id} />
                                    <div className="flex-1">
                                        <label htmlFor="name" className="sr-only">Business Name</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={business.name}
                                            required
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-gray-900"
                                            placeholder="Enter new business name"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-blue-200"
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No Business Found</h3>
                            <p className="mt-1 text-sm text-gray-500 mb-6">Get started by creating your business profile below.</p>

                            <form action={saveBusiness} className="max-w-sm mx-auto">
                                <div className="mb-4 text-left">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Acme Corp"
                                        required
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-gray-900"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Create Business
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
