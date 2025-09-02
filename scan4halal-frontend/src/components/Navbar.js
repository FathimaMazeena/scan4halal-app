import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Left side: Logo */}
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Scan4Halal</a>
      </div>

      {/* Center: Menu items */}
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

      {/* Right side: Search + Login + Avatar */}
      <div className="navbar-end gap-3">
        {/* Search box */}
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-28 md:w-56 rounded-full"
        />

        {/* Login button */}
        <a className="btn btn-outline btn-sm rounded-full">Login</a>

        {/* Avatar dropdown */}
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
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Saved Scans</a>
            </li>
            <li>
              <a>History</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
