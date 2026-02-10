const ComplaintCard = ({
    complaint,
    technicians,
    onAssign,
    onPriorityChange,
    onClose,
    onReopen,
    onDelete,
  }) => {
    const canClose = complaint.status === "COMPLETED";
    const canReopen = complaint.status === "REJECTED" || complaint.status === "CLOSED";

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
  
        {complaint.image && (
          <img
            className="card__image"
            src={complaint.image}
            alt={`${complaint.title} evidence`}
          />
        )}
  
        <div className="card__meta">
          {complaint.token && <p>Token: {complaint.token}</p>}
          {complaint.priority && <p>Priority: {complaint.priority}</p>}
          {complaint.createdAt && (
            <p>Created: {new Date(complaint.createdAt).toLocaleString()}</p>
          )}
          {complaint.createdBy && <p>By: {complaint.createdBy.name}</p>}
        </div>
  
        <div className="card__actions">
          <select
            className="input"
            onChange={(e) => onAssign(complaint._id, e.target.value)}
            value={complaint.assignedTo?._id || ""}
          >
            <option value="" disabled>
              Assign to
            </option>
            {(technicians || []).map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
  
          <select
            className="input"
            onChange={(e) => onPriorityChange(complaint._id, e.target.value)}
            value={complaint.priority || ""}
          >
            <option value="" disabled>
              Set priority
            </option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {onClose && (
            <button
              className="button button--primary"
              onClick={() => onClose(complaint._id)}
              disabled={!canClose}
              title={canClose ? "Close complaint" : "Only completed complaints can be closed"}
            >
              Close
            </button>
          )}

          {onReopen && (
            <button
              className="button button--ghost"
              onClick={() => onReopen(complaint._id)}
              disabled={!canReopen}
              title={canReopen ? "Reopen complaint" : "Only rejected/closed complaints can be reopened"}
            >
              Reopen
            </button>
          )}

          {onDelete && (
            <button
              className="button button--danger"
              onClick={() => onDelete(complaint._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default ComplaintCard;
  
