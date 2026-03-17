import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="4"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function MedicineSelect() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}api/products/`);
        if (!response.ok) throw new Error("Products are not loaded.");
        const data = await response.json();
        setProducts(data);
        if (data.length > 0) setSelected(data[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleContinue = () => {
  if (!selected) return;

  const selectedProduct = products.find((p) => p.id === selected);
  const token = localStorage.getItem("access_token");
  
  const state = {
    selected_product_id: selected,
    selected_service_id: selectedProduct.service.id,
  };


  if (!token) {
    navigate("/signup", { state });
  } else {
    navigate("/questionnaire", { state });
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-900 font-medium">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="main flex flex-col">
      <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 font-sans">
        <div className="flex flex-col w-full max-w-sm gap-5">

          <h1 className="text-2xl font-bold text-green-950">Select a medicine</h1>

          {products.map((product, index) => (
            <label
              key={product.id}
              onClick={() => setSelected(product.id)}
              className={`flex flex-col rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                selected === product.id
                  ? "border-green-900 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {index === 0 && (
                <div className="flex items-center justify-center py-2 bg-green-900">
                  <span className="text-xs font-medium text-green-200 tracking-wide">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-row items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base font-bold text-green-950">
                      {product.name}
                    </span>
                    <span className="text-sm text-green-950">
                      starting at{" "}
                      <span className="font-bold">${product.price}/mo*</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 shrink-0 bg-green-100 rounded-xl">
                    <span className="text-green-700 text-xs font-bold">Rx</span>
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    <PlusIcon />
                    {product.service.name}
                  </span>
                </div>
                <p className="text-xs text-green-800 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-1 text-green-700 text-xs font-medium">
                    <ShieldIcon />
                    Safety Information
                  </div>
                  <input
                    type="radio"
                    name="option"
                    readOnly
                    checked={selected === product.id}
                    className="w-5 h-5 border-2 border-green-900 accent-green-900"
                  />
                </div>
              </div>
            </label>
          ))}

          <button
            onClick={handleContinue}
            className="flex items-center justify-center w-full py-4 rounded-xl bg-green-900 text-white font-semibold text-base"
          >
            Continue
          </button>

        </div>
      </div>
    </div>
  );
}