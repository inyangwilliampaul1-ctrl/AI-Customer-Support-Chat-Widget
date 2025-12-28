import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions'
import { LayoutDashboard, LogOut, Building2, MessageCircleQuestion } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col bg-white border-r border-gray-200 md:flex">
                <div className="flex h-16 items-center justify-center border-b px-6">
                    <span className="text-lg font-bold text-gray-800">AI Customer Support Widget</span>
                </div>
                <nav className="flex-1 space-y-1 px-4 py-4">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/business" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <Building2 className="mr-3 h-5 w-5" />
                        Business
                    </Link>
                    <Link href="/dashboard/faqs" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <MessageCircleQuestion className="mr-3 h-5 w-5" />
                        FAQs
                    </Link>
                    {/* Add more links here */}
                </nav>
                <div className="border-t p-4">
                    <div className="flex items-center mb-4 px-2">
                        <div className="text-sm truncate w-full" title={user.email}>
                            <p className="font-medium text-gray-700">{user.email}</p>
                        </div>
                    </div>
                    <form action={signout}>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
