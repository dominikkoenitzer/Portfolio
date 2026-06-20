import { Navigate } from "react-router-dom";

// Splat route: redirect any unmatched path back to the homepage.
const CatchAll = () => <Navigate replace to="/" />;

export default CatchAll;
