import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold mb-8">AI Customer Support Widget</h1>
            </div>

            <div className="flex gap-4">
                <Link href="/login" className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition">
                    Login
                </Link>
                <Link href="/register" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Register
                </Link>
            </div>
        </main>
    );
}
