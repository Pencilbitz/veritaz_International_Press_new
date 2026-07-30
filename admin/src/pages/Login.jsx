import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../json_data/firebase";
import { motion, AnimatePresence } from 'framer-motion';



export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await setPersistence(auth, browserLocalPersistence);

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/admin");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">



            <form
                onSubmit={login}
                className="bg-white shadow-lg rounded-xl p-8 w-96"
            >
                <div className="flex flex-col items-center justify-center mb-8">
                    <img
                        src="/logo.jpg"
                        alt="Veritaz Logo"
                        className="w-20 h-20 rounded-full object-cover mb-4"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl font-bold text-brand-dark">
                            Veritaz
                        </h1>
                        <p className="text-sm text-brand-gray">
                            International Press
                        </p>
                    </motion.div>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Admin Login
                </h2>

                <input
                    className="border rounded w-full p-3 mb-4"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border rounded w-full p-3 mb-6"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="bg-blue-600 text-white w-full py-3 rounded"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}