import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PartnerDashboard from "@/pages/PartnerDashboard";
import TeamManagement from "@/pages/TeamManagement";
import CommissionHistory from "@/pages/CommissionHistory";
import WithdrawalPage from "@/pages/WithdrawalPage";
import { AuthProvider } from '@/contexts/authContext';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<PartnerDashboard />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/commission" element={<CommissionHistory />} />
        <Route path="/withdrawal" element={<WithdrawalPage />} />
        <Route path="/about" element={<div className="text-center text-xl py-10">关于我们 - 开发中</div>} />
      </Routes>
    </AuthProvider>
  );
}
