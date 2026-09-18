import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div className="min-h-screen bg-[#f7f7f5]">

            {/* Navbar */}
            <nav className="border-b border-zinc-200 bg-white">

                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">

                    <Link
                        to="/"
                        className="text-2xl font-extrabold tracking-tight"
                    >
                        Short<span className="text-zinc-500">ly</span>
                    </Link>


                    <div className="flex items-center gap-4">

                        <span className="hidden text-sm text-zinc-500 sm:block">
                            user@example.com
                        </span>

                        <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50">
                            Logout
                        </button>

                    </div>

                </div>

            </nav>


            <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">

                <div className="mb-8">

                    <p className="mb-3 text-xs font-bold tracking-[0.2em] text-zinc-500">
                        DASHBOARD
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Your short URLs
                    </h1>

                </div>


                {/* Create URL */}
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">

                    <h2 className="mb-5 text-lg font-semibold">
                        Create a short URL
                    </h2>

                    <form className="flex flex-col gap-3 sm:flex-row">

                        <input
                            type="url"
                            placeholder="https://example.com/your-long-url"
                            required
                            className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-7 py-3 font-semibold text-white hover:bg-zinc-800"
                        >
                            Shorten
                        </button>

                    </form>

                </section>


                {/* URL List */}
                <section className="mt-12">

                    <div className="mb-5 flex items-center justify-between">

                        <h2 className="text-xl font-semibold">
                            Recent URLs
                        </h2>

                        <span className="text-sm text-zinc-500">
                            0 links
                        </span>

                    </div>


                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-20 text-center">

                        <div className="mb-4 text-3xl">
                            ↗
                        </div>

                        <h3 className="font-semibold">
                            No short URLs yet
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500">
                            Create your first short URL above.
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;