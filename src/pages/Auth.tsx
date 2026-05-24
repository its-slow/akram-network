import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // هنحتاج نضبط ملف الـ firebase عشان نصدر auth
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (isLogin: boolean) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("تم تسجيل الدخول بنجاح!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("تم إنشاء الحساب، أهلاً بك!");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0e] text-white">
      <input className="text-black p-2 m-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="text-black p-2 m-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <div className="flex gap-2">
        <button className="bg-blue-600 p-2 rounded" onClick={() => handleAuth(true)}>دخول</button>
        <button className="bg-gray-600 p-2 rounded" onClick={() => handleAuth(false)}>إنشاء حساب جديد</button>
      </div>
    </div>
  );
}
