import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo.webp";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="wl-surface border-b wl-border sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt=""
              className="h-10 w-10 shrink-0 rounded bg-slate-50 p-1 object-contain ring-1 ring-slate-900/10"
            />
            <div className="flex flex-col">
              <span className="wiki-page-title text-lg leading-tight">WikiLavalleja</span>
              <span className="hidden sm:block text-[10px] leading-tight wl-muted -mt-0.5">
                Archivo histórico-cultural de Minas y Lavalleja
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-sm transition-colors ${
                isActive
                  ? "wl-surface-2 wl-accent font-medium"
                  : "wl-muted hover:wl-accent"
              }`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/#articulos"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-sm transition-colors ${
                isActive
                  ? "wl-surface-2 wl-accent font-medium"
                  : "wl-muted hover:wl-accent"
              }`
            }
          >
            Artículos
          </NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
