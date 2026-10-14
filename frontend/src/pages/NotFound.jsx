import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="btn-view-job">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
