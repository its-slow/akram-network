import { useState } from "react";
import { auth } from "./lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // عشان نغير بين الدخول والإنشاء

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("تم الدخول يا هندسة!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("تم إنشاء الحساب يا بطل!");
      }
    } catch (err) {
      alert("حصل خطأ، اتأكد من البيانات");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Akram-Network</h2>
        <form onSubmit={handleAction}>
          <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 mb-4 rounded bg-gray-800 text-white" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="كلمة المرور" className="w-full p-3 mb-6 rounded bg-gray-800 text-white" onChange={(e) => setPassword(e.target.value)} />
          
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded mb-4">
            {isLogin ? "دخول للنظام" : "إنشاء حساب جديد"}
          </button>
          
          <button type="button" className="text-gray-400 w-full text-sm" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "معندكش حساب؟ اضغط هنا لإنشاء حساب" : "عندك حساب؟ اضغط هنا للدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
