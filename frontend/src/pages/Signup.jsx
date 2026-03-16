import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''


const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selected_product_id, selected_service_id } = location.state ?? {};

  console.log(selected_product_id, selected_service_id);

  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data === "object") setErrors(data);
        else setApiError("Something went wrong. Please try again.");
        return;
      }
      localStorage.setItem("access_token", data.tokens.access);
      localStorage.setItem("refresh_token", data.tokens.refresh);

        const state = {
            selected_product_id: selected_product_id,
            selected_service_id: selected_service_id,
        };
 
        navigate("/questionnaire", { state });

    } catch (err) {
      setApiError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
    { name: "phone_number", label: "Phone Number", type: "tel", placeholder: "03001234567" },
  ];

  return (
    <div className="min-h-screen flex font-sans">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-green-950">Create your account</h1>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-green-700 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-green-950">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                    placeholder:text-gray-300 bg-gray-50 focus:bg-white focus:border-green-700
                    ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors[name] && (
                  <p className="text-xs text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-green-950">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all
                    placeholder:text-gray-300 bg-gray-50 focus:bg-white focus:border-green-700
                    ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {form.password && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= strength ? strengthColor[strength] : "#E5E7EB" }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-green-900 text-white font-semibold text-sm
                hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            By signing up, you agree to our{" "}
            <span className="text-green-700 cursor-pointer hover:underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-green-700 cursor-pointer hover:underline">Privacy Policy</span>
          </p>

        </div>
      </div>
    </div>
  );
}