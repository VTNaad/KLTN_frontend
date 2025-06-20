import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";
import Home from "./pages/Home";
import HotelSearchResults from "./components/HotelSearchResults";
import AdminLayout from "./admin/Config/AdminLayout";
import HotelInfo from "./pages/HotelInfo";
import HotelCheckout from "./pages/HotelCheckout";
import AccountPage from "./pages/AccountPage";
import FlightSearchResults from "./components/FlightSearchResults";
import FlightCheckout from "./pages/FlightCheckout";
import VoucherDetail from "./components/VoucherDetail";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          {/* Routes có Header */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/resultHotel" element={<HotelSearchResults />} />
            <Route path="/resultFlight" element={<FlightSearchResults />} />
            <Route path="/hotelInfo" element={<HotelInfo />} />
            <Route path="/voucher/:id" element={<VoucherDetail />} />
            <Route path="/checkout" element={<HotelCheckout />} />
            <Route path="/checkout-flight/:id" element={<FlightCheckout />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
export default App;
