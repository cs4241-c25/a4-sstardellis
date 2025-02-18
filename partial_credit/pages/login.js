import { signIn } from "next-auth/react";


// login component with just GitHub button
export default function Login() {
    return (
        <div className="bg-gradient-to-t from-yellow-500 to-red-600 flex justify-center items-center min-h-screen">
            <main className="bg-white p-8 rounded-lg shadow-lg w-96">
                <div className="text-center mb-2">
                    <h1 className="text-3xl font-bold">Workout Logger</h1>
                </div>
                <header className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Login</h1>
                </header>
                <button
                    onClick={() => signIn("github")}
                    className="w-full bg-gray-800 text-white py-3 rounded-md block text-center">
                    Login with GitHub
                </button>
            </main>
        </div>
    );
}
