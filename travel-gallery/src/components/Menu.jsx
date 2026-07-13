import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import config from "../config";

/**
 * Das einzige Navigationselement der Website: ein Hamburger-Menü oben rechts.
 * Enthält Filter (Jahr, Ort, Reise), die Suche und den Login/Logout-Link.
 * Es gibt bewusst keine weiteren Icons oder Menüpunkte.
 */
export default function Menu({
  years,
  places,
  trips,
  filters,
  onChangeFilters,
  search,
  onSearchChange,
  onOpenLogin,
  onOpenAdmin,
}) {
  const [open, setOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  function toggleFilter(type, value) {
    onChangeFilters({
      ...filters,
      [type]: filters[type] === value ? null : value,
    });
  }

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
      >
        <span className={`menu-icon ${open ? "menu-icon--open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div className="menu-panel" role="dialog" aria-label="Navigation">
          <div className="menu-section">
            <input
              type="text"
              className="menu-search"
              placeholder={config.search.placeholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {isAdmin && (
            <div className="menu-section">
              <button
                className="menu-link menu-link--admin"
                onClick={() => {
                  onOpenAdmin();
                  setOpen(false);
                }}
              >
                Admin-Bereich
              </button>
            </div>
          )}

          <MenuFilterGroup
            title="Jahr"
            values={years}
            active={filters.year}
            onSelect={(v) => toggleFilter("year", v)}
          />
          <MenuFilterGroup
            title="Ort"
            values={places}
            active={filters.place}
            onSelect={(v) => toggleFilter("place", v)}
          />
          <MenuFilterGroup
            title="Reisen"
            values={trips}
            active={filters.trip}
            onSelect={(v) => toggleFilter("trip", v)}
          />

          <div className="menu-section menu-section--login">
            {isAdmin ? (
              <button
                className="menu-link"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Abmelden
              </button>
            ) : (
              <button
                className="menu-link"
                onClick={() => {
                  onOpenLogin();
                  setOpen(false);
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MenuFilterGroup({ title, values, active, onSelect }) {
  if (!values || values.length === 0) return null;
  return (
    <div className="menu-section">
      <p className="menu-heading">{title}</p>
      <ul className="menu-list">
        {values.map((value) => (
          <li key={value}>
            <button
              className={`menu-link ${active === value ? "menu-link--active" : ""}`}
              onClick={() => onSelect(value)}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
