import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    fetchRequests();
    fetchStaff();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get("/requests");
    setRequests(res.data.data);
  };

  const fetchStaff = async () => {
    const res = await API.get("/auth/staff");
    setStaff(res.data.data);
  };

  const assign = async (id) => {
    const staffId = selectedStaff[id];
    if (!staffId) return alert("Select staff");

    await API.put(`/requests/assign/${id}`, { staffId });
    alert("Assigned");
    fetchRequests();
  };

  const deleteReq = async (id) => {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/requests/${id}`);
    fetchRequests();
  };

  const createUser = async () => {
    await API.post("/auth/create-user", newUser);
    alert("User created");
    setNewUser({ name:"",email:"",password:"",role:"staff" });
    fetchStaff();
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Admin Dashboard</h2>

      {/* CREATE STAFF/STUDENT */}
      <h3>Create User</h3>

      <input
        placeholder="Name"
        value={newUser.name}
        onChange={(e)=>setNewUser({...newUser,name:e.target.value})}
      />
      <br/><br/>

      <input
        placeholder="Email"
        value={newUser.email}
        onChange={(e)=>setNewUser({...newUser,email:e.target.value})}
      />
      <br/><br/>

      <input
        placeholder="Password"
        value={newUser.password}
        onChange={(e)=>setNewUser({...newUser,password:e.target.value})}
      />
      <br/><br/>

      <select
        value={newUser.role}
        onChange={(e)=>setNewUser({...newUser,role:e.target.value})}
      >
        <option value="staff">Staff</option>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <br/><br/>
      <button onClick={createUser}>Create User</button>

      <hr/>
      <h3>All Requests</h3>

      {requests.map((r)=>(
        <div key={r._id} style={{border:"1px solid gray",margin:10,padding:10}}>
          <b>{r.title}</b>
          <p>{r.description}</p>

          {r.image && <img src={r.image} width="200"/>}

          <p>Status: {r.status}</p>

          {r.createdBy && <p>Created by: {r.createdBy.name}</p>}
          {r.assignedTo && <p>Assigned to: {r.assignedTo.name}</p>}
          {r.closedBy && <p>Closed by: {r.closedBy.name}</p>}

          <p>Created: {new Date(r.createdAt).toLocaleString()}</p>

          {r.assignedAt && (
            <p>Assigned: {new Date(r.assignedAt).toLocaleString()}</p>
          )}

          {r.closedAt && (
            <p>Closed: {new Date(r.closedAt).toLocaleString()}</p>
          )}

          {r.rejectReason && (
            <p style={{color:"red"}}>Reject: {r.rejectReason}</p>
          )}

          {/* ASSIGN */}
          {!r.assignedTo && r.status === "Open" && (
            <>
              <select
                onChange={(e)=>
                  setSelectedStaff({...selectedStaff,[r._id]:e.target.value})
                }
              >
                <option>Select staff</option>
                {staff.map(s=>(
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>

              <button onClick={()=>assign(r._id)}>Assign</button>
            </>
          )}

          <br/>
          <button onClick={()=>deleteReq(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
