import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AdminLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await login(String(data.get("email")), String(data.get("password")));
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo ingresar");
    }
  }

  return (
    <main className="page admin-login">
      <form className="admin-login-card stack-form" onSubmit={onSubmit}>
        <p className="eyebrow">Ari´s Bags</p>
        <h1 className="page-title">Ingreso al estudio</h1>
        <p className="muted">Pedidos, bolsas y los dibujos de Ari, en un solo lugar.</p>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required />
        </label>
        <label className="field">
          <span>Contraseña</span>
          <input name="password" type="password" required minLength={8} />
        </label>
        {error && <p className="stock-out">{error}</p>}
        <button className="btn btn-primary" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}
