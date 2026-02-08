import { useEffect, useState } from "react";
import API from "../services/api";

function StudentDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await API.get("/requests");
    setRequests(res.data.data);
  };

  const convertImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const create = async (e) => {
    e.preventDefault();

    await API.post("/requests", {
      title,
      description,
      image,
    });

    alert("Request created");
    setTitle("");
    setDescription("");
    setImage("");
    fetchRequests();
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Student Dashboard</h2>

      <h3>Create Request</h3>

      <form onSubmit={create}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />
        <br/><br/>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          required
        />
        <br/><br/>

        <input type="file" onChange={convertImage}/>
        <br/><br/>

        <button type="submit">Submit Request</button>
      </form>

      <hr/>
      <h3>My Requests</h3>

      {requests.map((r)=>(
        <div key={r._id} style={{border:"1px solid gray",padding:10,margin:10}}>
          <b>{r.title}</b>
          <p>{r.description}</p>

          {r.image && <img src={r.image} width="200"/>}

          <p>Status: {r.status}</p>

          <p>
            Created: {new Date(r.createdAt).toLocaleString()}
          </p>

          {r.assignedTo && (
            <p>Assigned to: {r.assignedTo.name}</p>
          )}

          {r.closedAt && (
            <p>Closed: {new Date(r.closedAt).toLocaleString()}</p>
          )}

          {r.rejectReason && (
            <p style={{color:"red"}}>
              Rejected: {r.rejectReason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;
