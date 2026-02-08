import { useEffect, useState } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) {
    return <Login />;
  }

  // 🟢 ROLE ROUTING
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "staff") return <StaffDashboard />;
  return <StudentDashboard />;
}

export default App;
