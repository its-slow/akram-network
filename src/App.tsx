import { useState } from "react";
import { auth, db } from "./lib/firebase // تأكد من مسار ملف الفايربيز عندك
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم الدخول بنجاح يا هندسة!");
      // هنا ممكن تعمل Redirect لصفحة لوحة التحكم
    } catch (err) {
      setError("يا بطل فيه خطأ في البيانات، اتأكد تاني");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-2 text-white text-center">Akram-Network</h2>
        <p className="text-gray-400 mb-8 text-center">أدخل بيانات السيرفر</p>

        {error && <p className="text-red-500 bg-red-500/10 p-2 rounded mb-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 mb-6 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg shadow-blue-900/20"
          >
            دخول للنظام
          </button>
        </form>
      </div>
    </div>
  );
}
