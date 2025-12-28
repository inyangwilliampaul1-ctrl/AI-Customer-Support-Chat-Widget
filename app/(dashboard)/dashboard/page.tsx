import ChatWidget from '@/components/ChatWidget';

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder stats */}
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Users</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Revenue</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Active Sessions</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
            </div>
            <ChatWidget />
        </div>
    )
}
