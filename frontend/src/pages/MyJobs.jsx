import { useEffect, useState } from "react";
import { API } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
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

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [salaryType, setSalaryType] = useState("fixed");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyJobs = async () => {
    try {
      const { data } = await API.get("/job/getmyjobs");
      setJobs(data.myJobs);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const formatSalary = (job) => {
    if (job.fixedSalary) return `$${Number(job.fixedSalary).toLocaleString()}`;
    if (job.salaryFrom && job.salaryTo)
      return `$${Number(job.salaryFrom).toLocaleString()} – $${Number(job.salaryTo).toLocaleString()}`;
    return "Negotiable";
  };

  const openEdit = (job) => {
    // Detect salary type from the existing job data
    const type = job.fixedSalary ? "fixed" : "ranged";
    setSalaryType(type);
    setEditingJob(job._id);
    setEditForm({
      title: job.title,
      description: job.description,
      category: job.category,
      country: job.country,
      city: job.city,
      location: job.location,
      fixedSalary: job.fixedSalary || "",
      salaryFrom: job.salaryFrom || "",
      salaryTo: job.salaryTo || "",
      expired: job.expired,
    });
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setEditForm({});
    setSalaryType("fixed");
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSalaryTypeChange = (type) => {
    setSalaryType(type);
    // Clear the opposite salary fields when switching type
    if (type === "fixed") {
      setEditForm((prev) => ({ ...prev, salaryFrom: "", salaryTo: "" }));
    } else {
      setEditForm((prev) => ({ ...prev, fixedSalary: "" }));
    }
  };

  const handleUpdate = async (id) => {
    // Validate salary based on selected type
    if (salaryType === "fixed" && !editForm.fixedSalary) {
      toast.error("Please enter a fixed salary.");
      return;
    }
    if (salaryType === "ranged" && (!editForm.salaryFrom || !editForm.salaryTo)) {
      toast.error("Please enter both salary range values.");
      return;
    }

    // Build clean payload — only send the relevant salary fields
    // so Mongoose doesn't validate empty strings on the unused fields
    const payload = {
      title: editForm.title,
      description: editForm.description,
      category: editForm.category,
      country: editForm.country,
      city: editForm.city,
      location: editForm.location,
      expired: editForm.expired,
    };

    if (salaryType === "fixed") {
      payload.fixedSalary = editForm.fixedSalary;
      payload.salaryFrom = undefined;
      payload.salaryTo = undefined;
    } else {
      payload.salaryFrom = editForm.salaryFrom;
      payload.salaryTo = editForm.salaryTo;
      payload.fixedSalary = undefined;
    }

    setSaving(true);
    try {
      const { data } = await API.put(`/job/update/${id}`, payload);
      toast.success(data.message || "Job updated!");
      cancelEdit();
      fetchMyJobs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const { data } = await API.delete(`/job/delete/${id}`);
      toast.success(data.message || "Job deleted.");
      setJobs((prev) => prev.filter((j) => j._id !== id));
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
        <h1>My Jobs</h1>
        <p>{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>You have not posted any jobs yet.</p>
        </div>
      ) : (
        <div className="job-manage-list">
          {jobs.map((job) =>
            editingJob === job._id ? (
              /* ---- Edit Form ---- */
              <div key={job._id} className="job-edit-card">
                <h3>Edit Job</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={editForm.title} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={editForm.category} onChange={handleEditChange}>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <input name="country" value={editForm.country} onChange={handleEditChange} />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" value={editForm.city} onChange={handleEditChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={editForm.location} onChange={handleEditChange} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows={4} value={editForm.description} onChange={handleEditChange} />
                </div>

                {/* Salary type toggle */}
                <div className="form-group">
                  <label>Salary Type</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        checked={salaryType === "fixed"}
                        onChange={() => handleSalaryTypeChange("fixed")}
                      />
                      Fixed Salary
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={salaryType === "ranged"}
                        onChange={() => handleSalaryTypeChange("ranged")}
                      />
                      Salary Range
                    </label>
                  </div>
                </div>

                {salaryType === "fixed" ? (
                  <div className="form-group">
                    <label>Fixed Salary ($)</label>
                    <input
                      type="number"
                      name="fixedSalary"
                      value={editForm.fixedSalary}
                      onChange={handleEditChange}
                      placeholder="e.g. 50000"
                    />
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Salary From ($)</label>
                      <input
                        type="number"
                        name="salaryFrom"
                        value={editForm.salaryFrom}
                        onChange={handleEditChange}
                        placeholder="e.g. 40000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Salary To ($)</label>
                      <input
                        type="number"
                        name="salaryTo"
                        value={editForm.salaryTo}
                        onChange={handleEditChange}
                        placeholder="e.g. 70000"
                      />
                    </div>
                  </div>
                )}

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="expired"
                      checked={editForm.expired}
                      onChange={handleEditChange}
                    />
                    Mark as Expired
                  </label>
                </div>

                <div className="edit-actions">
                  <button className="btn-submit" onClick={() => handleUpdate(job._id)} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              /* ---- Job Card ---- */
              <div key={job._id} className="job-manage-card">
                <div className="job-manage-info">
                  <div className="job-manage-header">
                    <span className="job-category">{job.category}</span>
                    {job.expired && <span className="badge-expired">Expired</span>}
                  </div>
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span><FaMapMarkerAlt /> {job.city}, {job.country}</span>
                    <span><FaDollarSign /> {formatSalary(job)}</span>
                  </div>
                  <p className="job-description">
                    {job.description.length > 100
                      ? job.description.slice(0, 100) + "..."
                      : job.description}
                  </p>
                </div>
                <div className="job-manage-actions">
                  <button className="btn-edit" onClick={() => openEdit(job)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                  >
                    <FaTrash /> {deletingId === job._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
