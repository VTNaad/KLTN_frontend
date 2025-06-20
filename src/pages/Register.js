import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/speak.png"; // Đường dẫn ảnh nền

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    email: "",
    phone: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const { username, password, fullname, email, phone } = formData;
    try {
      const response = await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, fullname, email, phone }),
      });
      console.log("Body:", JSON.stringify({ formData })); // Log the response object
      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(true);

        // Automatically navigate to home after 2 seconds
        setTimeout(() => {
          setIsModalOpen(false);
          navigate("/login");
        }, 2000);
      } else {
        alert(data.message || "Đăng ký không thành công!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra trong quá trình đăng ký! Vui lòng thử lại.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", position: "relative" }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />

      {/* Left side - Register Form */}
      <Grid item xs={12} sm={4} md={3} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 2,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="dense"
              required
              fullWidth
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F2F5",
                borderRadius: "3px",
                fontSize: "0.9rem",
              }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="email"
              placeholder="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F2F5",
                borderRadius: "3px",
                fontSize: "0.9rem",
              }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="phone"
              placeholder="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F2F5",
                borderRadius: "3px",
                fontSize: "0.9rem",
              }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F2F5",
                borderRadius: "3px",
                fontSize: "0.9rem",
              }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F2F5",
                borderRadius: "3px",
                fontSize: "0.9rem",
              }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F2F5",
                borderRadius: "3px",
                fontSize: "0.9rem",
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1.5,
                mb: 1,
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#45a049" },
                textTransform: "none",
                borderRadius: "10px",
                padding: "8px 0",
              }}
            >
              Sign up
            </Button>
            <Box sx={{ textAlign: "center", fontSize: "0.9rem" }}>
              <Typography variant="body2" display="inline">
                Already have an account?
              </Typography>
              <Link
                onClick={() => navigate("/login")}
                variant="body2"
                sx={{ ml: 0.5, color: "#4CAF50", cursor: "pointer" }}
              >
                Sign in
              </Link>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Right side - Welcome Section */}
      <Grid
        item
        xs={false}
        sm={8}
        md={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 4,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Join Our Community!
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "60%", opacity: 0.9 }}>
          Sign up now to start your journey with our platform.
        </Typography>
      </Grid>
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              width: "300px",
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Chúc mừng!</h2>
            <p style={{ marginBottom: "20px" }}>
              Đăng ký thành công! Bạn có thể đăng nhập{" "}
            </p>
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate("/login");
              }}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Grid>
  );
};

export default Register;
