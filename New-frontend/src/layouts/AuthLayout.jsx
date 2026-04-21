import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="auth-page">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
