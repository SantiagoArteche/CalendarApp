export const Navbar = () => {
  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
      <span className="navbar-brand">
        <i className="fas fa-calendar-alt "></i>
        <span className="ms-3">Santiago</span>
      </span>
      <button className="btn btn-outline-danger">
        <i className="fas fa-sign-out-alt"></i>
        <span className="ms-1">Logout</span>
      </button>
    </div>
  );
};
