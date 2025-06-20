import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import "../Style/widget.scss";

const Widget = ({ type }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  let data;
  const diff = 30; // Static growth percentage (example)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = "";

        // Define API endpoints for each type
        if (type === "customer") {
          endpoint = `${apiUrl}/user/count`;
        } else if (type === "orders") {
          endpoint = `${apiUrl}/orders/count`;
        } else if (type === "earnings") {
          endpoint = `${apiUrl}/orders/revenue`;
        }

        if (endpoint) {
          const response = await fetch(endpoint);
          const result = await response.json();

          if (result.success) {
            setCount(
              type === "earnings"
                ? `${result.data.hotelRevenue} + ${result.data.flightRevenue} = ${result.data.totalRevenue}` // Set total earnings for "earnings" widget
                : type === "customer"
                ? result.data.userCount // Set user count for "customer" widget
                : `${result.data.hotelOrders} + ${result.data.flightOrders} = ${result.data.orderCount}` // Set package count for "order" widget
            );
          }
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  // Define widget data based on type
  switch (type) {
    case "customer":
      data = {
        title: "CUSTOMERS",
        isMoney: false,
        link: "See details",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "#ff000033" }}
          />
        ),
        navigateTo: "/admin/users",
      };
      break;
    case "orders":
      data = {
        title: "HOTEL & FLIGHT BOOKING",
        isMoney: false,
        link: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{ color: "goldenrod", backgroundColor: "#daa52033" }}
          />
        ),
        navigateTo: "/admin/orders",
      };
      break;
    case "earnings":
      data = {
        title: "TOTAL EARNINGS",
        isMoney: true,
        // link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ color: "green", backgroundColor: "#00800033" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "MY BALANCE",
        isMoney: true,
        link: "Withdraw money",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "#80008033" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  const handleLinkClick = () => {
    if (data?.navigateTo) {
      navigate(data.navigateTo);
    }
  };

  return (
    <div className={`widget ${type}`}>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {loading ? "Loading..." : data.isMoney ? `${count}` : count}
        </span>
        <span className="link" onClick={handleLinkClick}>
          {data.link}
        </span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff}%
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
