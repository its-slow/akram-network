import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // التعديل هنا: الصفحة هتعمل ريفريش وتفتح "البرنامج" فوراً
        window.location.reload(); 
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("تم إنشاء الحساب، سجل دخولك الآن!");
      }
    } catch {
      alert("خطأ في البيانات!");
    }
  };

  if (loading) return <div className="text-white p-10">جاري التحميل...</div>;

  // --- هنا "البرنامج الرئيسي" اللي بتدور عليه ---
  if (user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl text-white font-bold">واجهة برنامج Akram-Network</h1>
        <p className="text-blue-400">أهلاً بك يا هندسة، هنا مكان التحكم في الشبكة</p>
        <button onClick={() => { signOut(auth); window.location.reload(); }} className="mt-4 bg-red-600 text-white p-2 rounded">خروج</button>
      </div>
    );
  }

  // --- هنا صفحة الدخول ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <form onSubmit={handleAction} className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm">
        <h2 className="text-white text-center mb-6 text-2xl font-bold">Akram-Network</h2>
        <input type="email" placeholder="البريد" className="w-full p-3 mb-4 rounded bg-gray-800 text-white" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="w-full p-3 mb-4 rounded bg-gray-800 text-white" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">
          {isLogin ? "دخول للبرنامج" : "إنشاء حساب"}
        </button>
        <button type="button" className="text-gray-400 text-sm mt-4 w-full" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "معندكش حساب؟" : "عندك حساب؟"}
        </button>
      </form>
    </div>
  );
}
