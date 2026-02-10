import { useMemo, useState } from "react";
import API from "../services/api";

const TechnicianComplaintCard = ({ complaint, setNotice, onUpdated }) => {
  const [busy, setBusy] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  const actions = useMemo(() => {
    switch (complaint.status) {
      case "ASSIGNED":
        return ["IN_PROGRESS", "REJECTED"];
      case "IN_PROGRESS":
        return ["COMPLETED", "REJECTED"];
      default:
        return [];
    }
  }, [complaint.status]);

  const updateStatus = async (status) => {
    setBusy(true);
    try {
      await API.put(`/complaints/status/${complaint._id}`, {
        status,
        reason: status === "REJECTED" ? rejectReason : undefined,
        resolutionNote: status === "COMPLETED" ? resolutionNote : undefined,
      });
      setNotice?.({ tone: "success", message: `Updated: ${status}` });
      setRejectReason("");
      setResolutionNote("");
      onUpdated?.();
    } catch (error) {
      setNotice?.({
        tone: "error",
        message: error.response?.data?.message || "Unable to update status.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h4>{complaint.title}</h4>
          <p className="muted">{complaint.description}</p>
        </div>
        <span
          className={`status status--${complaint.status
            ?.toLowerCase()
            .replaceAll("_", "-")}`}
        >
          {complaint.status?.replaceAll("_", " ")}
        </span>
      </div>

      <div className="card__meta">
        {complaint.token && <p>Token: {complaint.token}</p>}
        {complaint.createdAt && (
          <p>Created: {new Date(complaint.createdAt).toLocaleString()}</p>
        )}
        {complaint.createdBy?.name && <p>By: {complaint.createdBy.name}</p>}
      </div>

      {actions.includes("REJECTED") && (
        <label className="form__label">
          Reject reason (required to reject)
          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g., Not enough details"
            disabled={busy}
          />
        </label>
      )}

      {actions.includes("COMPLETED") && (
        <label className="form__label">
          Resolution note (optional)
          <input
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="e.g., Replaced the door lock"
            disabled={busy}
          />
        </label>
      )}

      <div className="card__actions">
        {actions.includes("IN_PROGRESS") && (
          <button
            type="button"
            className="button button--primary"
            onClick={() => updateStatus("IN_PROGRESS")}
            disabled={busy}
          >
            Start Work
          </button>
        )}
        {actions.includes("COMPLETED") && (
          <button
            type="button"
            className="button button--primary"
            onClick={() => updateStatus("COMPLETED")}
            disabled={busy}
          >
            Mark Completed
          </button>
        )}
        {actions.includes("REJECTED") && (
          <button
            type="button"
            className="button button--danger"
            onClick={() => updateStatus("REJECTED")}
            disabled={busy || !rejectReason.trim()}
            title={!rejectReason.trim() ? "Provide a reject reason" : "Reject complaint"}
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
};

export default TechnicianComplaintCard;
