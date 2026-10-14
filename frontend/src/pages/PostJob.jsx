import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../context/AuthContext";
import toast from "react-hot-toast";

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

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    location: "",
    salaryType: "fixed",
    fixedSalary: "",
    salaryFrom: "",
    salaryTo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      country: form.country,
      city: form.city,
      location: form.location,
    };

    if (form.salaryType === "fixed") {
      if (!form.fixedSalary) {
        toast.error("Please enter a fixed salary.");
        return;
      }
      payload.fixedSalary = form.fixedSalary;
    } else {
      if (!form.salaryFrom || !form.salaryTo) {
        toast.error("Please enter both salary range values.");
        return;
      }
      payload.salaryFrom = form.salaryFrom;
      payload.salaryTo = form.salaryTo;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/job/post", payload);
      toast.success(data.message || "Job posted successfully!");
      navigate("/my-jobs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container container">
      <div className="form-card">
        <h1>Post a Job</h1>
        <p className="form-subtitle">Fill in the details to publish a new job listing.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Job Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. React Developer"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                name="country"
                placeholder="e.g. India"
                value={form.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="e.g. Patiala"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Full Location / Address</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Describe responsibilities, requirements, and benefits..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Salary type toggle */}
          <div className="form-group">
            <label>Salary Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="salaryType"
                  value="fixed"
                  checked={form.salaryType === "fixed"}
                  onChange={handleChange}
                />
                Fixed Salary
              </label>
              <label>
                <input
                  type="radio"
                  name="salaryType"
                  value="ranged"
                  checked={form.salaryType === "ranged"}
                  onChange={handleChange}
                />
                Salary Range
              </label>
            </div>
          </div>

          {form.salaryType === "fixed" ? (
            <div className="form-group">
              <label htmlFor="fixedSalary">Fixed Salary (₹)</label>
              <input
                id="fixedSalary"
                type="number"
                name="fixedSalary"
                placeholder="e.g. 50000"
                value={form.fixedSalary}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryFrom">Salary From (₹)</label>
                <input
                  id="salaryFrom"
                  type="number"
                  name="salaryFrom"
                  placeholder="e.g. 40000"
                  value={form.salaryFrom}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="salaryTo">Salary To (₹)</label>
                <input
                  id="salaryTo"
                  type="number"
                  name="salaryTo"
                  placeholder="e.g. 70000"
                  value={form.salaryTo}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
