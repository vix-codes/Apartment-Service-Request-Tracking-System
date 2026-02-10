import API from "../services/api";

const TenantComplaintCard = ({ complaint, setNotice, onUpdated }) => {
  const canReopen = complaint.status === "REJECTED";

  const handleReopen = async () => {
    try {
      await API.put(`/complaints/status/${complaint._id}`, { status: "NEW" });
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
    <div className="card">
      <h3>{complaint.title}</h3>
      <p>{complaint.description}</p>
      <p>Status: {complaint.status}</p>
      <p>Created at: {new Date(complaint.createdAt).toLocaleString()}</p>
      {complaint.token && <p>Token: {complaint.token}</p>}
      {complaint.assignedTo?.name && <p>Assigned to: {complaint.assignedTo.name}</p>}
      <button
        className="button button--ghost"
        type="button"
        onClick={handleReopen}
        disabled={!canReopen}
        title={canReopen ? "Reopen complaint" : "Only rejected complaints can be reopened"}
      >
        Reopen
      </button>
    </div>
  );
};

export default TenantComplaintCard;
