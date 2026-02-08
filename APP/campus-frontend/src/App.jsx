import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotificationBell from "./components/NotificationBell";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  if (role === "admin") {
    return (
      <>
        <div className="topbar">
          <div className="topbar__brand">Campus Service</div>
          <NotificationBell />
        </div>
        <AdminDashboard />
      </>
    );
  }

  if (role === "staff") {
    return (
      <>
        <div className="topbar">
          <div className="topbar__brand">Campus Service</div>
          <NotificationBell />
        </div>
        <StaffDashboard />
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar__brand">Campus Service</div>
        <NotificationBell />
      </div>
      <StudentDashboard />
    </>
  );
}

export default App;
