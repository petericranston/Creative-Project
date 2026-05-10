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
        className="bg-[#16113a] border border-[#3d4199] hover:bg-[#1e1a4a] text-white font-medium text-xl py-2 px-3 rounded-lg mb-3 text-center"
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
