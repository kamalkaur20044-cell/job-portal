import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API, useAuth } from "../context/AuthContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaRupeeSign } from "react-icons/fa";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/job/${id}`);
        setJob(data.job);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Job not found.");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  if (loading) return <Spinner />;
  if (!job) return null;

  const formatSalary = () => {
    if (job.fixedSalary) return `₹${Number(job.fixedSalary).toLocaleString("en-IN")} / year`;
    if (job.salaryFrom && job.salaryTo)
      return `₹${Number(job.salaryFrom).toLocaleString("en-IN")} – ₹${Number(job.salaryTo).toLocaleString("en-IN")} / year`;
    return "Negotiable";
  };

  return (
    <div className="page-container container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <span className="job-category">{job.category}</span>
            <h1>{job.title}</h1>
          </div>
          {job.expired ? (
            <span className="badge-expired">Expired</span>
          ) : (
            isAuthenticated &&
            user?.role === "Job Seeker" && (
              <Link to={`/application/${job._id}`} className="btn-apply">
                Apply Now
              </Link>
            )
          )}
        </div>

        <div className="job-detail-meta">
          <div className="meta-item">
            <FaMapMarkerAlt />
            <span>
              {job.city}, {job.country}
            </span>
          </div>
          <div className="meta-item">
            <FaRupeeSign />
            <span>{formatSalary()}</span>
          </div>
          <div className="meta-item">
            <FaCalendarAlt />
            <span>Posted: {new Date(job.jobPostedOn).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="job-detail-section">
          <h2>Location</h2>
          <p>{job.location}</p>
        </div>

        <div className="job-detail-section">
          <h2>Job Description</h2>
          <p className="job-description-full">{job.description}</p>
        </div>

        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>
              <Link to="/login">Login</Link> or <Link to="/register">Register</Link> as a
              Job Seeker to apply for this job.
            </p>
          </div>
        )}

        {isAuthenticated && user?.role === "Employer" && (
          <div className="auth-prompt">
            <p>Employers cannot apply for jobs. Switch to a Job Seeker account to apply.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
