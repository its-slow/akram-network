import { useState, useEffect } from "react";
import { auth, db } from "./lib/firebase"; // اتأكد من المسار ده
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      alert("خطأ! اتأكد من البيانات يا بطل");
    }
  };

  // لو المستخدم عامل دخول، اعرض لوحة التحكم
  if (user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">لوحة تحكم Akram-Network</h1>
          <button onClick={() => signOut(auth)} className="bg-red-600 px-4 py-2 rounded">خروج</button>
        </div>
        <p>أهلاً بك يا هندسة، النظام شغال معاك!</p>
      </div>
    );
  }

  // لو مش عامل دخول، اعرض صفحة الدخول
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Akram-Network</h2>
        <form onSubmit={handleAction}>
          <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="كلمة المرور" className="w-full p-3 mb-6 rounded bg-gray-800 text-white border border-gray-700" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded mb-4 font-bold">
            {isLogin ? "دخول للنظام" : "إنشاء حساب"}
          </button>
          <button type="button" className="text-gray-400 w-full text-sm" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "لا تملك حساب؟ سجل الآن" : "لديك حساب؟ سجل دخولك"}
          </button>
        </form>
      </div>
    </div>
  );
}
