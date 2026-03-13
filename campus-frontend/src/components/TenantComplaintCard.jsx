import API from "../services/api";
import StatusPipeline from "./StatusPipeline";

const TenantComplaintCard = ({ complaint, setNotice, onUpdated }) => {
  const canReopen = complaint.status === "REJECTED" || complaint.status === "COMPLETED";

  const handleReopen = async () => {
    try {
      await API.put(`/complaints/status/${complaint._id}`, { status: "OPEN" }); // Should go back to OPEN, not NEW for existing tokens
      setNotice?.({ tone: "success", message: "Complaint reopened." });
      onUpdated?.();
    } catch (error) {
      setNotice?.({
        message: error.response?.data?.message || "Unable to reopen complaint.",
        tone: "error",
      });
    }
  };

  return (
    <div className="card glass-card">
      <div className="card__header">
        <div className="card__title-group">
          <h3 className="card__title">{complaint.title}</h3>
          <p className="secondary-text card__description">{complaint.description}</p>
        </div>
        <span
          className={`status status--${complaint.status
            ?.toLowerCase()
            .replaceAll("_", "-")}`}
        >
          {complaint.status?.replaceAll("_", " ")}
        </span>
      </div>

      <StatusPipeline currentStatus={complaint.status} />

      <div className="card__meta">
        {complaint.token && <p>Token: {complaint.token}</p>}
        {complaint.assignedTo?.name && (
          <p>
            Assigned to: <strong>{complaint.assignedTo.name}</strong>
          </p>
        )}
        <p>Created: {new Date(complaint.createdAt).toLocaleString()}</p>
      </div>

      <div className="card__actions">
        {canReopen && (
          <button
            className="button button--primary"
            type="button"
            onClick={handleReopen}
          >
            Reopen Request
          </button>
        )}
      </div>
    </div>
  );
};

export default TenantComplaintCard;
