import { useEffect, useState } from "react";
import API from "../services/api";
import ActivityFeed from "../components/ActivityFeed";
import NoticeBanner from "../components/NoticeBanner";

function StaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests");
      setRequests(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const startWork = async (id) => {
    try {
      await API.put(`/requests/status/${id}`, {
        status: "In Progress",
      });

      setNotice({ tone: "success", message: "Marked as in progress." });
      fetchRequests();
    } catch {
      setNotice({ tone: "error", message: "Unable to update status." });
    }
  };

  const closeTask = async (id) => {
    try {
      await API.put(`/requests/status/${id}`, {
        status: "Closed",
      });

      setNotice({ tone: "success", message: "Request closed." });
      fetchRequests();
    } catch {
      setNotice({ tone: "error", message: "Unable to update status." });
    }
  };

  const rejectTask = async (id) => {
    if (!reason) {
      setNotice({ tone: "error", message: "Enter a rejection reason." });
      return;
    }

    try {
      await API.put(`/requests/status/${id}`, {
        status: "Rejected",
        reason: reason,
      });

      setReason("");
      setNotice({ tone: "success", message: "Request rejected." });
      fetchRequests();
    } catch {
      setNotice({ tone: "error", message: "Unable to reject request." });
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2>Staff Dashboard</h2>
          <p className="muted">Track and resolve assigned requests.</p>
        </div>
        <button className="button button--ghost" onClick={logout}>Logout</button>
      </div>

      <NoticeBanner
        message={notice?.message}
        tone={notice?.tone}
        onClose={() => setNotice(null)}
      />

      <div className="grid">
        {requests
          .filter(r => r.assignedTo)
          .map((req) => (
            <div
              key={req._id}
              className="card"
            >
              <div className="card__header">
                <div>
                  <h4>{req.title}</h4>
                  <p className="muted">{req.description}</p>
                </div>
                <span className={`status status--${req.status?.toLowerCase().replace(" ", "-")}`}>
                  {req.status}
                </span>
              </div>

              {req.image && <img className="card__image" src={req.image} alt={`${req.title} evidence`} />}

              <div className="card__meta">
                {req.createdAt && (
                  <p>Created: {new Date(req.createdAt).toLocaleString()}</p>
                )}

                {req.assignedAt && (
                  <p>Assigned: {new Date(req.assignedAt).toLocaleString()}</p>
                )}
              </div>

              <div className="card__actions">
                {req.status === "Assigned" && (
                  <button className="button button--primary" onClick={() => startWork(req._id)}>
                    Start Work
                  </button>
                )}

                {req.status === "In Progress" && (
                  <>
                    <button className="button button--success" onClick={() => closeTask(req._id)}>
                      Close
                    </button>

                    <input
                      className="input"
                      placeholder="Reject reason"
                      value={reason}
                      onChange={(e)=>setReason(e.target.value)}
                    />

                    <button className="button button--danger" onClick={() => rejectTask(req._id)}>
                      Reject
                    </button>
                  </>
                )}

                {req.status === "Closed" && <span className="status status--closed">Closed ✔</span>}
              </div>
            </div>
          ))}
      </div>

      <ActivityFeed />
    </div>
  );
}

export default StaffDashboard;
