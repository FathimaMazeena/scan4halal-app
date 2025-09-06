import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/browse">
          Scan4Halal
        </Link>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          <li>
            <Link to="/browse">Browse</Link>
          </li>
          <li>
            <a>About</a>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-3">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-28 md:w-56 rounded-full"
        />

        {!isAuthenticated ? (
          // Show Login when not authenticated
          <Link className="btn btn-outline btn-sm rounded-full" to="/login">
            Login
          </Link>
        ) : (
          // Show Avatar menu when authenticated
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <Link className="btn btn-outline btn-sm rounded-full" to="/scans">Saved Scans</Link>
              </li>
              <li>
                <a>Bookmarks</a>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
