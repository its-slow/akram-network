import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// ⚠️ اسحب هنا أي مكونات أو مكون البرنامج القديم بتاعك لو كان مفصول في ملفات تانية
// import MainDashboard from "./components/MainDashboard"; 

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // مراقبة حالة المستخدم بدون الحاجة لعمل reload للمتصفح
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // تنظيف الـ listener عند إغلاق المكون
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        // تسجيل الدخول - الـ Firebase هيدخل اليوزر تلقائياً والصفحة هتتحول بدون ريفريش
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

  // --- 🌟 هنا السيستم والبرنامج القديم بتاعك بيرجع يشتغل 🌟 ---
  if (user) {
    return (
      <>
        {/* شريط علوي بسيط عشان تقدر تعمل خروج من الحساب في أي وقت */}
        <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800 text-white">
          <span className="text-sm text-gray-400">حساب: {user.email}</span>
          <button 
            onClick={() => signOut(auth)} 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            خروج من الحساب
          </button>
        </div>

        {/* ⬇️ حط كود واجهة شبكة أكرم القديمة بالكامل هنا ⬇️ */}
        <div className="p-6">
          
          {/* 
              🚨 امسح السطور اللي تحت دي وحط كود الـ HTML/TSX بتاع برنامجك الأصلي 
              (اللوحة، أزرار التحكم، السيرفرات، المشتركين، إلخ...)
          */}
          <h1 className="text-3xl text-white font-bold">لوحة تحكم Akram-Network</h1>
          <p className="text-blue-400 mt-2">تم استعادة النظام وتأمين الدخول بنجاح.</p>
          
          {/* لو عندك الـ Dashboard القديم في مكون خارجي استدعيه كدة: <MainDashboard /> */}

        </div>
      </>
    );
  }

  // --- 🔒 صفحة تسجيل الدخول (تظهر فقط لو مش مسجل) ---
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
