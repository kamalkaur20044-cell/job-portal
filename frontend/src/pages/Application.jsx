import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaUpload } from "react-icons/fa";

const ALLOWED_TYPES = ["application/pdf"];
const ALLOWED_LABEL = "PDF only";
const MAX_SIZE_MB = 5;

const Application = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResume(null);
      setResumePreview(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Invalid file type. Please upload a ${ALLOWED_LABEL} image.`);
      e.target.value = "";
      setResume(null);
      setResumePreview(null);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be less than ${MAX_SIZE_MB} MB.`);
      e.target.value = "";
      setResume(null);
      setResumePreview(null);
      return;
    }

    setResume(file);
    // createObjectURL works correctly for images — shows instant preview
    setResumePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!resume) {
      toast.error("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("coverLetter", form.coverLetter);
    formData.append("jobId", jobId);
    formData.append("resume", resume);

    setLoading(true);
    try {
      const { data } = await API.post("/application/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message || "Application submitted!");
      navigate("/my-applications");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container container">
      <div className="form-card">
        <h1>Apply for Job</h1>
        <p className="form-subtitle">Fill in your details to submit your application.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                <FaUser /> Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone /> Phone
              </label>
              <input
                id="phone"
                type="number"
                name="phone"
                placeholder="03001234567"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <FaMapMarkerAlt /> Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="e.g. 123 Street, City"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">
              <FaFileAlt /> Cover Letter <span className="optional-label">(Optional)</span>
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={6}
              placeholder="Tell the employer why you're a great fit for this role... (optional)"
              value={form.coverLetter}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">
              <FaUpload /> Resume / CV ({ALLOWED_LABEL})
            </label>
            <input
              id="resume"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
            />
            <p className="field-hint">
              Upload your resume as a PDF. Max {MAX_SIZE_MB} MB.
            </p>
            {resumePreview && (
              <div className="resume-preview">
                <p>Preview:</p>
                <embed
                  src={resumePreview}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Application;
