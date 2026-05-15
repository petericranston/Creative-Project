import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

const links = [
  { to: "/", label: "Overview" },
  { to: "/contribution", label: "Contribution" },
  { to: "/analysis", label: "Analysis" },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      {/* Burger menu */}
      <button
        className="lg:hidden fixed top-6 right-6 text-white text-2xl"
        onClick={() => setNavOpen(!navOpen)}
      >
        {navOpen ? "✕" : "☰"}
      </button>

      {/* Mobile nav menu*/}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#111827] z-40 flex flex-col p-8 gap-4 mt-22">
          <NavLink
            to="/settings"
            onClick={() => setNavOpen(false)}
            className="text-white text-xl bg-[#1f2937] py-3 px-4 rounded-lg text-center"
          >
            Settings
          </NavLink>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setNavOpen(false)}
              className="text-white text-xl bg-[#1f2937] py-3 px-4 rounded-lg text-center border border-[#3d4199]"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Nav bar for larger screen */}
      <nav className="nav hidden lg:flex">
        <NavLink
          to="/settings"
          className="bg-[#1f2937] text-white font-medium text-xl py-2 px-3 rounded-lg mb-3 text-center"
        >
          Settings
        </NavLink>
        <ul className="links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                className="link border border-[#3d4199]"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
