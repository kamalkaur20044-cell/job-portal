import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../context/AuthContext";
import { FaMapMarkerAlt, FaBriefcase,FaSearch, FaRupeeSign } from "react-icons/fa";
import Spinner from "../components/Spinner";

const CATEGORIES = [
  "Graphics & Design",
  "Mobile App Development",
  "Frontend Web Development",
  "MERN Stack Development",
  "Account & Finance",
  "Artificial Intelligence",
  "Video Animation",
  "MEAN Stack Development",
  "Data Entry Operator",
  "Virtual Assistant",
  "Others",
];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/job/getall");
        setJobs(data.jobs);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.city.toLowerCase().includes(search.toLowerCase()) ||
      job.country.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? job.category === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  const formatSalary = (job) => {
    if (job.fixedSalary) return `${Number(job.fixedSalary).toLocaleString("en-IN")}`;
    if (job.salaryFrom && job.salaryTo)
      return `${Number(job.salaryFrom).toLocaleString("en-IN")} – ${Number(job.salaryTo).toLocaleString("en-IN")}`;
    return "Negotiable";
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job Today</h1>
          <p>Thousands of openings. One platform. Start your next chapter.</p>
          <div className="hero-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, city or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search jobs"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stat">
          <span className="stat-number">{jobs.length}+</span>
          <span className="stat-label">Active Jobs</span>
        </div>
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Companies</span>
        </div>
        <div className="stat">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Job Seekers</span>
        </div>
      </section>

      {/* Main content */}
      <section className="home-main container">
        {/* Sidebar: categories */}
        <aside className="category-sidebar">
          <h3>Categories</h3>
          <ul>
            <li
              className={!selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory("")}
            >
              All Categories
            </li>
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        {/* Job cards */}
        <div className="jobs-grid">
          <div className="jobs-grid-header">
            <h2>
              {selectedCategory ? selectedCategory : "All Jobs"}
              <span className="job-count"> ({filtered.length})</span>
            </h2>
          </div>

          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <FaBriefcase size={48} />
              <p>No jobs found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="job-cards">
              {filtered.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <span className="job-category">{job.category}</span>
                    {job.expired && <span className="badge-expired">Expired</span>}
                  </div>
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta">
                    <span>
                      <FaMapMarkerAlt /> {job.city}, {job.country}
                    </span>
                    <span>
                      <FaRupeeSign /> {formatSalary(job)}
                    </span>
                  </div>
                  <p className="job-description">
                    {job.description.length > 120
                      ? job.description.slice(0, 120) + "..."
                      : job.description}
                  </p>
                  <Link to={`/jobs/${job._id}`} className="btn-view-job">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
