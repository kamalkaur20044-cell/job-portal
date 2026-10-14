const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status" aria-label="Loading">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
