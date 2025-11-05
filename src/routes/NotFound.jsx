import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>Oops! That page doesn’t exist.</p>
      <Link to="/">Return Home</Link>
    </div>
  );
}