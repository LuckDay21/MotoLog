import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, UserPlus, Chrome } from "lucide-react";

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (err) {
      console.error("Auth error:", err);

      // User-friendly error messages
      let errorMessage = err.message;
      if (err.code === "auth/configuration-not-found") {
        errorMessage =
          "Firebase Authentication belum dikonfigurasi. Silakan setup Firebase Authentication terlebih dahulu.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage =
          "Email sudah terdaftar. Silakan login atau gunakan email lain.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah. Minimal 6 karakter.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "Email tidak terdaftar. Silakan daftar terlebih dahulu.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Password salah.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Koneksi internet bermasalah. Cek koneksi Anda.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google Sign In error:", err);

      let errorMessage = err.message;
      if (err.code === "auth/configuration-not-found") {
        errorMessage =
          "Google Sign In belum dikonfigurasi di Firebase. Silakan aktifkan Google Authentication di Firebase Console.";
      } else if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Login dibatalkan.";
      } else if (err.code === "auth/popup-blocked") {
        errorMessage =
          "Popup diblokir oleh browser. Silakan izinkan popup untuk website ini.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🏍️ MotoLog</h1>
          <p className="text-gray-600">Asisten Servis Motor Cerdas</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength="6"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              "Loading..."
            ) : isSignUp ? (
              <>
                <UserPlus size={20} />
                Daftar
              </>
            ) : (
              <>
                <LogIn size={20} />
                Masuk
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">atau</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          <Chrome size={20} className="text-blue-600" />
          Masuk dengan Google
        </button>

        {/* Toggle Sign Up/Sign In */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isSignUp
              ? "Sudah punya akun? Masuk di sini"
              : "Belum punya akun? Daftar di sini"}
          </button>
        </div>
      </div>
    </div>
  );
}
