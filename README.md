# شبكة اكرم — نظام إدارة الشبكة

## متطلبات التشغيل
- Node.js 18+ (من nodejs.org)
- npm أو pnpm

## خطوات التشغيل

### 1. ثبّت المكتبات
```
npm install
```

### 2. أنشئ ملف .env
انسخ ملف .env.example واسمّه .env ثم ضع مفتاح Clerk:
```
cp .env.example .env
```
- اشتغل على clerk.com وأنشئ حساب مجاني
- احصل على Publishable Key وضعه في .env

### 3. شغّل التطبيق
```
npm run dev
```
ثم افتح: http://localhost:5173

### 4. بناء النسخة النهائية
```
npm run build
```

## Firebase
البيانات محفوظة على:
https://akram-network-default-rtdb.firebaseio.com

## المميزات
- إضافة وتعديل وحذف أجهزة الشبكة
- مزامنة سحابية مع Firebase
- تسجيل دخول آمن عبر Clerk
- يعمل كتطبيق PWA على الموبايل
- واجهة عربية RTL
