import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../context/AuthContext";
import { FaMapMarkerAlt,FaSearch, FaFilter, FaRupeeSign } from "react-icons/fa";
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

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

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

  const cities = [...new Set(jobs.map((j) => j.city))].sort();

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.country.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? job.category === category : true;
    const matchCity = city ? job.city === city : true;
    return matchSearch && matchCategory && matchCity;
  });

  const formatSalary = (job) => {
    if (job.fixedSalary) return `₹${Number(job.fixedSalary).toLocaleString("en-IN")}`;
    if (job.salaryFrom && job.salaryTo)
      return `₹${Number(job.salaryFrom).toLocaleString("en-IN")} – ₹${Number(job.salaryTo).toLocaleString("en-IN")}`;
    return "Negotiable";
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCity("");
  };

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1>Browse All Jobs</h1>
        <p>{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-input">
          <FaSearch />
          <input
            type="text"
            placeholder="Search title or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        <div className="filter-select">
          <FaFilter />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-select">
          <FaMapMarkerAlt />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Filter by city"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {(search || category || city) && (
          <button className="btn-clear" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No jobs match your filters.</p>
        </div>
      ) : (
        <div className="job-list">
          {filtered.map((job) => (
            <div key={job._id} className="job-list-item">
              <div className="job-list-info">
                <span className="job-category">{job.category}</span>
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span>
                    <FaMapMarkerAlt /> {job.city}, {job.country}
                  </span>
                  <span>
                    <FaRupeeSign/>  {formatSalary(job)}
                  </span>
                </div>
                <p className="job-description">
                  {job.description.length > 150
                    ? job.description.slice(0, 150) + "..."
                    : job.description}
                </p>
              </div>
              <div className="job-list-action">
                <span className="job-date">
                  {new Date(job.jobPostedOn).toLocaleDateString()}
                </span>
                <Link to={`/jobs/${job._id}`} className="btn-view-job">
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
