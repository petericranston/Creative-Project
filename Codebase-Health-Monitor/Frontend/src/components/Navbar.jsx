import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

const links = [
  { to: "/", label: "Overview" },
  { to: "/contribution", label: "Contribution" },
  { to: "/risk", label: "Risk" },
];

export default function Navbar() {
  return (
    <nav className="nav">
      <ul className="links">
        {links.map((link) => (
          <li key={link}>
            <NavLink to={link.to} end className="link">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
