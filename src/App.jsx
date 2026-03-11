import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import MedicineSelect from "./pages/MedicineSelect";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/medicine" element={<MedicineSelect />} />
      </Route>

    </Routes>
  );
}