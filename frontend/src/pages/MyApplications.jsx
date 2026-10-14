import { useEffect, useState } from "react";
import { API } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFilePdf } from "react-icons/fa";
import Spinner from "../components/Spinner";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/application/jobseeker/getall");
      setApplications(data.applications);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    setDeletingId(id);
    try {
      const { data } = await API.delete(`/application/delete/${id}`);
      toast.success(data.message || "Application deleted.");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You have not applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="application-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-info">
                <h3>{app.name}</h3>
                <div className="application-meta">
                  <span>
                    <FaEnvelope /> {app.email}
                  </span>
                  <span>
                    <FaPhone /> {app.phone}
                  </span>
                  <span>
                    <FaMapMarkerAlt /> {app.address}
                  </span>
                </div>
                <div className="cover-letter-section">
                  <h4>Cover Letter</h4>
                  <p>{app.coverLetter}</p>
                </div>
              </div>

              <div className="application-resume">
                {app.resume?.url && (
                  <div className="resume-file">
                    <h4>Resume</h4>
                    <a
                      href={app.resume.url}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-file-link"
                    >
                      <FaFilePdf className="pdf-icon" />
                      <span>{app.name}&apos;s Resume.pdf</span>
                    </a>
                  </div>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(app._id)}
                  disabled={deletingId === app._id}
                  aria-label="Delete application"
                >
                  <FaTrash /> {deletingId === app._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
