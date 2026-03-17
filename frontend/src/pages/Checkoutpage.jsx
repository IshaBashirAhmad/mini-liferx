import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function Field({ label, value, onChange, placeholder, disabled = false, error = "" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-green-950">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
          ${disabled
            ? "bg-green-50 border-green-100 text-green-800 cursor-not-allowed"
            : "bg-gray-50 border-gray-200 focus:border-green-700 focus:bg-white"
          }
          ${error ? "border-red-400 bg-red-50" : ""}
          placeholder:text-gray-300`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selected_product_id, selected_service_id } = location.state ?? {};

  const token = localStorage.getItem("access_token");

  const [preData, setPreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await fetch(
          `${VITE_API_BASE_URL}api/orders/?product_id=${selected_product_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Checkout data not loaded.");
        const data = await response.json();
        setPreData(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selected_product_id) fetchCheckoutData();
    else setFetchError("Product ID missing. Please go back.");
  }, [selected_product_id]);

  const validate = () => {
    const newErrors = {};
    if (!city.trim()) newErrors.city = "City is required.";
    if (!address.trim()) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");

    try {
      const response = await fetch(`${VITE_API_BASE_URL}api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: selected_product_id,
          city,
          address,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setApiError(data?.detail || "Order is not placed. Try again.");
        return;
      }

      setOrderSuccess(true);
    } catch (err) {
      setApiError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-900 font-medium">Loading checkout...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-red-500 text-sm text-center">{fetchError}</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white font-sans">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="text-green-700">
            <CheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-green-950">Order Placed!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your order has been placed successfully. We'll review it and get back to you soon.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full py-3.5 rounded-xl bg-green-900 text-white text-sm font-semibold hover:bg-green-800 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-white font-sans">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-green-950">Checkout</h1>
          <p className="text-sm text-gray-400">Review your order and add delivery details.</p>
        </div>
        <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl px-4 py-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-green-600 font-medium">{preData?.product?.service}</p>
            <p className="text-base font-bold text-green-950">{preData?.product?.name}</p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-base font-bold text-green-900">${preData?.product?.price}/mo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">Your Info</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="flex flex-col gap-4">
          <Field
            label="Email Address"
            value={preData?.user?.email || ""}
            onChange={() => {}}
            disabled={true}
          />
          <Field
            label="Phone Number"
            value={preData?.user?.phone_number || ""}
            onChange={() => {}}
            disabled={true}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">Delivery Details</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="flex flex-col gap-4">
          <Field
            label="City"
            value={city}
            onChange={setCity}
            placeholder="e.g. Lahore"
            error={errors.city}
          />
          <Field
            label="Full Address"
            value={address}
            onChange={setAddress}
            placeholder="House #, Street, Area"
            error={errors.address}
          />
        </div>
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-green-900 text-white font-semibold text-sm
            hover:bg-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldIcon />
          <span>Your information is secure and encrypted</span>
        </div>

      </div>
    </div>
  );
}