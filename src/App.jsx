import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "@pages/Home";
import MedicineSelect from "@pages/MedicineSelect";
import Login from "@pages/Login";
import MainLayout from "@layouts/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/medicine" element={<MedicineSelect />} />
      </Route>

    </Routes>
  );
}