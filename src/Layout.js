import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
// import Footer from "./components/Footer";

function Layout() {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/signup"];

  const shouldShowHeaderAndFooter = !hideHeaderPaths.includes(location.pathname);

  return (
    <div>
      {shouldShowHeaderAndFooter && <SiteHeader />}
      <div className="main-content">
        <Outlet />
      </div>
      {/* {shouldShowHeaderAndFooter && <Footer />} */}
    </div>
  );
}

export default Layout;
