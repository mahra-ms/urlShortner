import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-[#f7f7f5]">

            {/* Navbar */}
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                <Link
                    to="/"
                    className="text-2xl font-extrabold tracking-tight"
                >
                    Short<span className="text-zinc-500">ly</span>
                </Link>

                <div className="flex items-center gap-3 sm:gap-6">

                    <Link
                        to="/login"
                        className="text-sm font-medium text-zinc-700 hover:text-black"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        Get Started
                    </Link>

                </div>

            </nav>


            {/* Hero */}
            <main className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-24 lg:py-28">

                <div>

                    <p className="mb-5 text-xs font-bold tracking-[0.2em] text-zinc-500">
                        SIMPLE • FAST • ANALYTICS
                    </p>

                    <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                        Turn long URLs into{" "}
                        <span className="text-zinc-500">
                            short links.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-600">
                        Create powerful short URLs, share them anywhere,
                        and track every click from one simple dashboard.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                        <Link
                            to="/signup"
                            className="rounded-lg bg-black px-6 py-3.5 text-center font-semibold text-white transition hover:bg-zinc-800"
                        >
                            Create Free Account
                        </Link>

                        <Link
                            to="/login"
                            className="rounded-lg border border-zinc-300 bg-white px-6 py-3.5 text-center font-semibold hover:bg-zinc-50"
                        >
                            Login
                        </Link>

                    </div>

                </div>


                {/* URL Preview */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/5">

                    <div className="flex h-12 items-center gap-2 border-b border-zinc-100 px-5">

                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />

                    </div>

                    <div className="p-7 sm:p-9">

                        <p className="mb-2 text-xs font-bold text-zinc-500">
                            YOUR LONG URL
                        </p>

                        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                            https://example.com/my-very-long-url
                        </div>


                        <div className="py-5 text-center text-2xl">
                            ↓
                        </div>


                        <p className="mb-2 text-xs font-bold text-zinc-500">
                            YOUR SHORT URL
                        </p>

                        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">

                            <span className="truncate text-sm font-medium">
                                shortly.app/my-url
                            </span>

                            <button className="shrink-0 rounded-md bg-black px-3 py-2 text-xs font-semibold text-white">
                                Copy
                            </button>

                        </div>

                    </div>

                </div>

            </main>


            {/* Features */}
            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border-t border-zinc-200 px-6 py-20 sm:grid-cols-3">

                <Feature
                    icon="↗"
                    title="Short URLs"
                    description="Create clean and memorable links in seconds."
                />

                <Feature
                    icon="◉"
                    title="Analytics"
                    description="Track clicks and understand your audience."
                />

                <Feature
                    icon="⚡"
                    title="Fast"
                    description="Redirect visitors quickly and reliably."
                />

            </section>

        </div>
    );
}


function Feature({ icon, title, description }) {
    return (
        <div>

            <div className="mb-5 text-2xl">
                {icon}
            </div>

            <h3 className="mb-2 text-lg font-semibold">
                {title}
            </h3>

            <p className="leading-7 text-zinc-500">
                {description}
            </p>

        </div>
    );
}


export default Home;