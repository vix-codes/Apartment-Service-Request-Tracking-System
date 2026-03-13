import StatusPipeline from "./StatusPipeline";

const ComplaintCard = ({
    complaint,
    technicians,
    onAssign,
    onPriorityChange,
    onClose,
    onReopen,
    onDelete,
  }) => {
    const canClose = ["COMPLETED", "IN_PROGRESS", "ASSIGNED"].includes(complaint.status);
    const canReopen = ["REJECTED", "CLOSED", "COMPLETED"].includes(complaint.status);

    return (
      <div className="card glass-card">
        <div className="card__header">
          <div className="card__title-group">
            <h4 className="card__title">{complaint.title}</h4>
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
  
        {complaint.image && (
          <img
            className="card__image"
            src={complaint.image}
            alt={`${complaint.title} evidence`}
          />
        )}
  
        <div className="card__meta">
          {complaint.token && <p>Token: <strong>{complaint.token}</strong></p>}
          <p>Priority: <strong style={{ textTransform: 'capitalize' }}>{complaint.priority || "Medium"}</strong></p>
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
              title={complaint.status === "COMPLETED" ? "Close complaint" : "Force close in-progress complaint"}
            >
              {complaint.status === "COMPLETED" ? "Close" : "Force Close"}
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
  
