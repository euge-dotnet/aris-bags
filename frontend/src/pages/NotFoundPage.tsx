import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Página no encontrada</h1>
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
