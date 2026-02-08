import { useEffect, useState } from "react";
import API from "../services/api";

function ActivityFeed() {
  const [logs, setLogs] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "admin") {
      fetchLogs();
    }
  }, [role]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/audit");
      setLogs(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (role !== "admin") {
    return (
      <div style={{ marginTop: 40 }}>
        <h3>System Activity Timeline</h3>
        <p>Activity logs are available to admins only.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h3>System Activity Timeline</h3>

      {logs.length === 0 && <p>No activity yet</p>}

      {logs.map((log) => (
        <div
          key={log._id}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "8px",
            marginBottom: "6px"
          }}
        >
          <b>{log.action.replaceAll("_"," ")}</b>
          <br />

          {log.performedBy && (
            <span>
              {log.performedBy.name} ({log.performedByRole})
            </span>
          )}

          <br />

          {log.note && <span>{log.note}</span>}

          <br />

          <small>
            {new Date(log.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
