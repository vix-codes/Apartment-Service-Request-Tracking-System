import { useEffect, useState } from "react";
import API from "../services/api";

function NotificationBell(){
  const [notifications,setNotifications] = useState([]);
  const [open,setOpen] = useState(false);

  const fetch = async ()=>{
    try{
      const res = await API.get('/notifications');
      setNotifications(res.data.data || []);
    }catch(err){
      console.error('fetch notifications', err);
    }
  };

  useEffect(()=>{ fetch(); },[]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = async (id)=>{
    try{
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n=> n._id===id?{...n,isRead:true}:n));
    }catch(err){
      console.error('mark read', err);
    }
  };

  return (
    <div className="notification">
      <button
        className="notification__button"
        onClick={()=>{setOpen(!open); if(!open) fetch();}}
        type="button"
      >
        <span aria-hidden>🔔</span>
        {unreadCount>0 && (
          <span className="notification__badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification__panel">
          <div className="notification__title">Notifications</div>
          {notifications.length===0 && <div className="notification__empty">No notifications</div>}
          {notifications.map(n=> (
<<<<<<< HEAD
            <div key={n._id} style={{padding:10,borderBottom:'1px solid #f1f1f1',background:n.isRead? 'white':'#f7fbff'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{fontWeight:700}}>{n.type?.toUpperCase() || 'INFO'}</div>
                <div style={{fontSize:12,color:'#999'}}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div style={{marginTop:6,fontSize:14}}>{n.message}</div>
              <div style={{marginTop:8}}>
                {!n.isRead && <button onClick={()=>markRead(n._id)} style={{padding:'6px 10px',background:'#0066cc',color:'white',border:'none',borderRadius:4,cursor:'pointer'}}>Mark read</button>}
=======
            <div key={n._id} className={`notification__item ${n.isRead ? "" : "notification__item--unread"}`}>
              <div className="notification__item-header">
                <div className="notification__type">{n.type?.toUpperCase() || 'INFO'}</div>
                <div className="notification__time">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="notification__message">{n.message}</div>
              <div className="notification__actions">
                {!n.isRead && (
                  <button
                    className="button button--primary button--small"
                    onClick={()=>markRead(n._id)}
                  >
                    Mark read
                  </button>
                )}
>>>>>>> 0ef72d2c0b21a2facd061fb285389aa5fbce0281
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
