import { CheckCircleIcon, HammerIcon, UserPlusIcon, AlertCircleIcon, ArchiveIcon } from "./icons";

const steps = [
  { key: "NEW", label: "Reported", icon: AlertCircleIcon },
  { key: "ASSIGNED", label: "Assigned", icon: UserPlusIcon },
  { key: "IN_PROGRESS", label: "In Progress", icon: HammerIcon },
  { key: "COMPLETED", label: "Resolved", icon: CheckCircleIcon },
  { key: "CLOSED", label: "Closed", icon: ArchiveIcon },
];

const StatusPipeline = ({ currentStatus }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isRejected = currentStatus === "REJECTED";

  if (isRejected) {
    return (
      <div className="pipeline pipeline--rejected">
        <div className="pipeline__step pipeline__step--active pipeline__step--danger">
          <div className="pipeline__icon-wrapper">
            <AlertCircleIcon />
          </div>
          <span className="pipeline__label">Rejected</span>
        </div>
        <p className="pipeline__note">This request has been rejected by the technician.</p>
      </div>
    );
  }

  return (
    <div className={`pipeline ${currentStatus === "REJECTED" ? "pipeline--rejected" : ""}`}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const Icon = step.icon;

        return (
          <div
            key={step.key}
            className={`pipeline__step ${isActive ? "pipeline__step--active" : ""} ${
              isPast ? "pipeline__step--past" : ""
            }`}
            title={step.label}
          >
            <div className="pipeline__icon-wrapper">
              <Icon />
            </div>
            {(isActive || steps.length < 4) && (
              <span className="pipeline__label">{step.label}</span>
            )}
            {index < steps.length - 1 && <div className="pipeline__connector" />}
          </div>
        );
      })}
    </div>
  );
};

export default StatusPipeline;
