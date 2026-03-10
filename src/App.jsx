import { Routes, Route } from "react-router-dom";

import "./index.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyLiferx from "./components/WhyLiferx";
import HowItWorks from "./components/HowitWorks";

import MedicineSelect from "/pages/MedicineSelect.jsx";

export default function App() {
  return (
    <div className="main flex flex-col">
      <Navbar />
      <HeroSection />
      <WhyLiferx />
      <HowItWorks />
      <Routes>
        <Route path="/medicine" element={<MedicineSelect />} />
      </Routes>
    </div>
  );
}