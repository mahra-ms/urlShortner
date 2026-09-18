import { Link } from "react-router-dom";

function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5 py-10">

            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-10">

                <Link
                    to="/"
                    className="mb-10 block text-2xl font-extrabold tracking-tight"
                >
                    Short<span className="text-zinc-500">ly</span>
                </Link>

                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                </h1>

                <p className="mt-2 text-zinc-500">
                    Login to manage your short URLs.
                </p>


                <form className="mt-8 space-y-5">

                    <div>

                        <label className="mb-2 block text-sm font-semibold">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />

                    </div>


                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black py-3.5 font-semibold text-white transition hover:bg-zinc-800"
                    >
                        Login
                    </button>

                </form>


                <p className="mt-7 text-center text-sm text-zinc-500">

                    Don't have an account?{" "}

                    <Link
                        to="/signup"
                        className="font-semibold text-black hover:underline"
                    >
                        Create one
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;