import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import Home from "@pages/Home";
import MedicineSelect from "@pages/MedicineSelect";
import Login from "@pages/Login";
import Signup from "@pages/Signup";
import MainLayout from "@layouts/MainLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/medicine" element={<MedicineSelect />} />
        </Route>
      </Routes>
    </Router>
  );
}