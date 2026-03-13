import IconButton from "./IconButton";
import { 
  RefreshIcon, 
  ActivityIcon, 
  ClockIcon, 
  UserIcon, 
  AlertCircleIcon, 
  CheckCircleIcon,
  InboxIcon,
  HammerIcon,
  XCircleIcon,
  ArchiveIcon
} from "./icons";

const msToHours = (ms) => {
  if (!ms || Number.isNaN(Number(ms))) return "0";
  return (Number(ms) / (1000 * 60 * 60)).toFixed(1);
};

const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`card metric-card ${colorClass}`}>
    <div className="metric-card__content">
      <div className="metric-card__info">
        <span className="metric-card__title">{title}</span>
        <span className="metric-card__value">{value}</span>
      </div>
      <div className="metric-card__icon-wrapper">
        <Icon className="metric-card__icon" />
      </div>
    </div>
  </div>
);

const Analytics = ({ analytics, loading, onRefresh }) => {
  const overview = analytics?.overview;
  const priority = analytics?.priority;
  const time = analytics?.time;
  const technicians = analytics?.technicians;

  return (
    <div className="analytics-dashboard">
      <div className="analytics-dashboard__header">
        <div className="analytics-dashboard__title-group">
          <h2>Analytics Overview</h2>
          <p className="secondary-text">Real-time performance metrics and status tracking</p>
        </div>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          className="glass-button"
          title={loading ? "Refreshing..." : "Refresh analytics"}
        >
          <RefreshIcon className={loading ? "spin" : ""} />
        </IconButton>
      </div>

      <div className="analytics-grid">
        {/* Status Metrics */}
        <MetricCard 
          title="Total Requests" 
          value={overview?.totalComplaints ?? "0"} 
          icon={InboxIcon}
          colorClass="metric-card--primary"
        />
        <MetricCard 
          title="New" 
          value={overview?.open ?? "0"} 
          icon={AlertCircleIcon}
          colorClass="metric-card--open"
        />
        <MetricCard 
          title="In Progress" 
          value={overview?.inProgress ?? "0"} 
          icon={HammerIcon}
          colorClass="metric-card--progress"
        />
        <MetricCard 
          title="Completed" 
          value={overview?.completed ?? "0"} 
          icon={CheckCircleIcon}
          colorClass="metric-card--completed"
        />

        {/* Priority & Time Metrics */}
        <MetricCard 
          title="Critical Priority" 
          value={priority?.critical ?? "0"} 
          icon={AlertCircleIcon}
          colorClass="metric-card--danger"
        />
        <MetricCard 
          title="Avg. Resolution" 
          value={`${msToHours(time?.avgResolutionMs)}h`} 
          icon={ClockIcon}
          colorClass="metric-card--info"
        />
        <MetricCard 
          title="Active Technicians" 
          value={technicians?.total ?? "0"} 
          icon={UserIcon}
          colorClass="metric-card--secondary"
        />
        <MetricCard 
          title="Rejected" 
          value={overview?.rejected ?? "0"} 
          icon={XCircleIcon}
          colorClass="metric-card--rejected"
        />
      </div>

      <div className="analytics-details-grid">
        <div className="card glass-card">
          <h4>Daily Performance</h4>
          <div className="analytics-stats">
            <div className="stat-item">
              <span className="stat-item__label">Created Today</span>
              <span className="stat-item__value">{time?.todayCreated ?? "0"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">Closed Today</span>
              <span className="stat-item__value">{time?.todayClosed ?? "0"}</span>
            </div>
          </div>
        </div>

        <div className="card glass-card">
          <h4>Status Distribution</h4>
          <div className="analytics-stats">
            <div className="stat-item">
              <span className="stat-item__label">Assigned</span>
              <span className="stat-item__value">{overview?.assigned ?? "0"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">Closed Total</span>
              <span className="stat-item__value">{overview?.closed ?? "0"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
  
