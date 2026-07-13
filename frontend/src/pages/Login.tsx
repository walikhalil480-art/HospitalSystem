import { LoginForm } from "../features/auth/components/LoginForm";
import { Activity } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl mb-4 border border-blue-400/30">
            <Activity className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">MedCore ERP</h1>
          <p className="text-blue-300/80 text-sm mt-1">Enterprise Hospital Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to continue</p>

          <LoginForm />
        </div>

        <p className="text-center text-sm text-blue-300/70 mt-6">
          © {new Date().getFullYear()} MedCore ERP · All rights reserved
        </p>
      </div>
    </div>
  );
}
