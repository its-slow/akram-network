import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// ✅ التعديل الأول: استدعاء واجهة البرنامج الأصلية بتاعتك
import NetworkApp from "./pages/NetworkApp";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError("خطأ في البريد أو كلمة المرور!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-10">
        جاري تحميل السيستم...
      </div>
    );
  }

  // --- 🌟 التعديل التاني: بمجرد الدخول، هيفتح برنامجك فوراً 🌟 ---
  if (user) {
    return (
      <>
        {/* شريط علوي صغير جداً لزرار الخروج عشان ما يبوظش شكل برنامجك */}
        <div className="bg-gray-900 p-2 flex justify-between items-center border-b border-gray-800 text-white">
          <span className="text-xs text-gray-400">حساب الإدارة: {user.email}</span>
          <button 
            onClick={() => signOut(auth)} 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            تسجيل خروج
          </button>
        </div>

        {/* ✅ هنا بيتم عرض واجهة الشبكة الخاصة بيك بالكامل بدون ريفريش */}
        <NetworkApp />
      </>
    );
  }

  // --- 🔒 صفحة تسجيل الدخول ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <form onSubmit={handleAction} className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl">
        <h2 className="text-white text-center mb-2 text-2xl font-bold tracking-wider">Akram-Network</h2>
        <p className="text-center text-gray-500 text-xs mb-6">نظام إدارة وتأمين الشبكة</p>
        
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-2 rounded text-sm text-center mb-4">{error}</div>}

        <input 
          type="email" 
          placeholder="البريد المعتمد" 
          required
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <input 
          type="password" 
          placeholder="كلمة المرور" 
          required
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold transition-colors">
          {isLogin ? "دخول للنظام" : "إنشاء حساب مسؤول"}
        </button>
        
        <button type="button" className="text-gray-500 hover:text-gray-400 text-sm mt-4 w-full text-center transition-colors" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "تحتاج حساب جديد؟ اضغط هنا" : "لديك حساب بالفعل؟ سجل دخولك"}
        </button>
      </form>
    </div>
  );
}
