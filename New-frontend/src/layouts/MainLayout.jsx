import { Outlet } from "react-router-dom";
import Navigation from "../Components/common/Navigation";
import Footer from "../Components/common/footer";

const MainLayout = () => {

  return (
    <>
      <Navigation />
      <main className="page">
          <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
