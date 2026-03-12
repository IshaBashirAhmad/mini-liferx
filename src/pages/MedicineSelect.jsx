import { useState } from "react";
import minoxidil from "@assets/Minoxidil.png";
import sprayLotion from "@assets/spray_lotion.png";
import twoInOne from "@assets/2-in-1.png";

const medicines = [
  {
    id: 1,
    name: "Viagra®",
    price: "$468/mo*",
    type: "Tablet",
    desc: "Brand-name ED medication. Best for occasional use with proven reliability.",
    img: minoxidil,
    recommended: true,
  },
  {
    id: 2,
    name: "Viagra®",
    price: "$468/mo*",
    type: "Tablet",
    desc: "Brand-name ED medication. Best for occasional use with proven reliability.",
    img: sprayLotion,
    recommended: false,
  },
  {
    id: 3,
    name: "Viagra®",
    price: "$468/mo*",
    type: "Tablet",
    desc: "Brand-name ED medication. Best for occasional use with proven reliability.",
    img: twoInOne,
    recommended: false,
  },
];

// Reusable SVGs
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
  const [selected, setSelected] = useState(1);

  return (
    <div className="main flex flex-col" >
        <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 font-sans">
            <div className="flex flex-col w-full max-w-sm gap-5">

                <h1 className="text-2xl font-bold text-green-950">Select a medicine</h1>

                {medicines.map((medicine) => (
                <label
                    key={medicine.id}
                    onClick={() => setSelected(medicine.id)}
                    className={`flex flex-col rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    selected === medicine.id
                        ? "border-green-900 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                >
                    {medicine.recommended && (
                    <div className="flex items-center justify-center py-2 bg-green-900">
                        <span className="text-xs font-medium text-green-200 tracking-wide">
                        Recommended
                        </span>
                    </div>
                    )}

                    <div className="flex flex-col gap-3 p-4">
                    <div className="flex flex-row items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                        <span className="text-base font-bold text-green-950">{medicine.name}</span>
                        <span className="text-sm text-green-950">
                            starting at <span className="font-bold">{medicine.price}</span>
                        </span>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 shrink-0">
                        <img src={medicine.img} alt={medicine.name} />
                        </div>
                    </div>

                    {/* Type Tag */}
                    <div className="flex flex-row items-center">
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        <PlusIcon />
                        {medicine.type}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-green-800 leading-relaxed">{medicine.desc}</p>

                    {/* Footer */}
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-1 text-green-700 text-xs font-medium">
                        <ShieldIcon />
                        Safety Information
                        </div>
                        <input
                        type="radio"
                        name="option"
                        readOnly
                        checked={selected === medicine.id}
                        className="w-5 h-5 border-2 border-green-900 accent-green-900"
                        />
                    </div>
                    </div>
                </label>
                ))}

                <button className="flex items-center justify-center w-full py-4 rounded-xl bg-green-900 text-white font-semibold text-base">
                Continue
                </button>

            </div>
        </div>
    </div>
  );
}