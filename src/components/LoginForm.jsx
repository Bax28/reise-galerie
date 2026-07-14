import { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Extrem einfaches Login-Fenster: nur Benutzername und Passwort.
 * Siehe README.md, Abschnitt "Admin-Zugang einrichten" für die Einrichtung.
 */
export default function LoginForm({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err) {
      setError("Benutzername oder Passwort ist falsch.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <label className="form-label" htmlFor="username">
          Benutzername
        </label>
        <input
          id="username"
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
        />

        <label className="form-label" htmlFor="password">
          Passwort
        </label>
        <input
          id="password"
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="form-error">{error}</p>}

        <button className="form-submit" type="submit" disabled={loading}>
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
        <button type="button" className="form-cancel" onClick={onClose}>
          Abbrechen
        </button>
      </form>
    </div>
  );
}
