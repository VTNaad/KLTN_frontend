import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import VoucherCarousel from "../components/VoucherCarousel";
import HotelList from "../components/HotelList";
import FlightList from "../components/FlightList";
import Footer from "../components/Footer";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div style={{ padding: "0px", textAlign: "center" }}>
      <SearchBox />
      <VoucherCarousel />

      <section id="hotelList">
        <HotelList />
      </section>

      <section id="flightList">
        <FlightList />
      </section>

      <Footer />
    </div>
  );
}

export default Home;
