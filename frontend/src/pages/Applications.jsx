import { useEffect, useState } from "react";
import { API } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFilePdf } from "react-icons/fa";
import Spinner from "../components/Spinner";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get("/application/employer/getall");
        setApplications(data.applications);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  if (loading) return <Spinner />;

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1>Received Applications</h1>
        <p>
          {applications.length} application{applications.length !== 1 ? "s" : ""} received
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications received yet.</p>
        </div>
      ) : (
        <div className="application-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card employer-card">
              <div
                className="application-summary"
                onClick={() => toggle(app._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggle(app._id)}
                aria-expanded={expanded === app._id}
              >
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
                </div>
                <span className="expand-toggle">
                  {expanded === app._id ? "▲ Hide" : "▼ View Details"}
                </span>
              </div>

              {expanded === app._id && (
                <div className="application-details">
                  <div className="cover-letter-section">
                    <h4>Cover Letter</h4>
                    <p>{app.coverLetter}</p>
                  </div>

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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
