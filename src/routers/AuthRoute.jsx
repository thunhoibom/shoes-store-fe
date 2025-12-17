import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.auth);

  return currentUser?.roles.some(role => role === "ROLE_ADMIN") ? children : <Navigate to="/" />;
};

export default AuthRoute;
