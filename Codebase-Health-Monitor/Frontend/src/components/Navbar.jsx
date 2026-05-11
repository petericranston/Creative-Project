import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

const links = [
  { to: "/", label: "Overview" },
  { to: "/contribution", label: "Contribution" },
  { to: "/analysis", label: "Analysis" },
];

export default function Navbar() {
  return (
    <nav className="nav">
      <NavLink
        to="/settings"
        className="bg-[#1f2937] hover:shadow-[0_0_12px_rgba(139,92,246,0.4)] text-white font-medium text-xl py-2 px-3 rounded-lg mb-3 text-center"
      >
        Settings
      </NavLink>
      <ul className="links ">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end className="link border border-[#3d4199]">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
