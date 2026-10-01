import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      Short<span className="text-gray-400">ly</span>
    </Link>
  );
}