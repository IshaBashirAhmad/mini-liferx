import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import MedicineSelect from "./pages/MedicineSelect";

export default function App() {
  return (
    <div className="main flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicine" element={<MedicineSelect />} />
      </Routes>
    </div>
  );
}