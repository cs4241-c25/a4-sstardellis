import { useRouter } from "next/router";

export default function Index() {
    const router = useRouter();

    const handleLogin = (event) => {
        event.preventDefault();
        // goes to dashboard page
        router.push("/dashboard");
    };

    /*
                    <header className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Login</h1>
                </header>
     */

    // login page from a3
    return (
        <div className="bg-gradient-to-t from-yellow-500 to-red-600 flex justify-center items-center min-h-screen">
            <main className="bg-white p-8 rounded-lg shadow-lg w-96">


                <div className="text-center mb-2">
                    <h1 className="text-3xl font-bold">Workout Logger</h1>
                </div>



                <form onSubmit={handleLogin} className="space-y-4">
                    <button
                        type="submit"

                        className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800"
                    >
                        Login
                    </button>

                </form>
            </main>
        </div>
    );
}
