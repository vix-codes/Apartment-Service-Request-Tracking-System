import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import NoticeBanner from "../components/NoticeBanner";
import NotificationBell from "../components/NotificationBell";
import TechnicianComplaintCard from "../components/TechnicianComplaintCard";
import AppBrand from "../components/AppBrand";

const TechnicianDashboard = () => {
  const { userName, logout } = useAuth();
  const [notice, setNotice] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: complaints, loading, refetch } = useFetch("/complaints");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <div className={`app-layout ${isDarkMode ? "dark" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar__logo">
          <AppBrand size="sm" label="ASRT" />
        </div>
        <nav className="sidebar__nav">
          <ul>
            <li className="active">Dashboard</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div>Welcome, {userName || "Technician"}</div>
          <input type="search" placeholder="Search..." />
          <div className="top-bar__actions">
            <NotificationBell />
            <button className="button button--ghost button--small" onClick={toggleDarkMode}>
              Toggle Theme
            </button>
            <button className="button button--ghost button--small" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <NoticeBanner
          message={notice?.message}
          tone={notice?.tone}
          onClose={() => setNotice(null)}
        />

        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Your Assigned Complaints</h3>
            <button className="button button--ghost" onClick={refetch} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="grid">
            {(complaints || []).map((complaint) => (
              <TechnicianComplaintCard
                key={complaint._id}
                complaint={complaint}
                setNotice={setNotice}
                onUpdated={refetch}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
