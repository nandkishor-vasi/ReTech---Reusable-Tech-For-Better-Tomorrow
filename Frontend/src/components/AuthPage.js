import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";

const Background = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  paddingTop: "40px", 
  paddingBottom: "20px",
  overflowY: "auto",
});


const GlassCard = styled(Card)({
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  borderRadius: "15px",
  paddingTop: "20px",
  padding: "25px",
  width: "550px", 
  maxWidth: "90%", 
  color: "white",
  textAlign: "center",
});


const StyledButton = styled(Button)({
  background: "linear-gradient(90deg,rgb(255, 112, 117), #fad0c4)",
  color: "white",
  fontWeight: "bold",
  textTransform: "none",
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  "&:hover": {
    background: "linear-gradient(90deg, #fad0c4, #ff9a9e)",
  },
});

const Footer = styled("div")({
  width: "100%",
  textAlign: "center",
  color: "white",
  fontSize: "14px",
  marginTop: "auto",
  padding: "8px 0",
  marginLeft: "-58px",
});



const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "DONOR",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const backendBaseUrl = "http://localhost:8080";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? `${backendBaseUrl}/api/auth/login`
      : `${backendBaseUrl}/api/auth/signup`;

    const body = isLogin
      ? { username: formData.username, password: formData.password }
      : { ...formData };

    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
      });

      const user = response.data;
      if (isLogin) {
        if (user.token) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: user.id,
              name: user.name,
              role: user.role,
              token: user.token,
              username: user.username,
            })
          );
          login(user);

          if (user?.role?.toUpperCase() === "DONOR") {
            navigate(`/donorDashboard/${user.id}`);
          } else if (user?.role?.toUpperCase() === "BENEFICIARY") {
            navigate(`/beneficiaryDashboard/${user.id}`);
          }
        } else {
          alert("Login failed. No token received.");
        }
      } else {
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <Background>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {isLogin ? "Login" : "Sign Up"}
            </Typography>

            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              {!isLogin && (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor:"rgb(166, 166, 166)"  }, // Change border color to off-white
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f5f5f5", 
                          },
                        }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor:"rgb(166, 166, 166)"  }, // Change border color to off-white
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f5f5f5", 
                          },
                        }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    margin="normal"
                    variant="outlined"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                    sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor:"rgb(166, 166, 166)"  }, // Change border color to off-white
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f5f5f5", 
                          },
                        }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    margin="normal"
                    variant="outlined"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor:"rgb(166, 166, 166)"  }, // Change border color to off-white
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f5f5f5", 
                          },
                        }}
                  />
                  <Select
                    fullWidth
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    margin="normal"
                    variant="outlined"
                  >
                    <MenuItem value="DONOR">Donor</MenuItem>
                    <MenuItem value="BENEFICIARY">Beneficiary</MenuItem>
                  </Select>
                </>
              )}

              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor:"rgb(166, 166, 166)"  }, // Change border color to off-white
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f5f5f5", 
                          },
                        }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor:"rgb(166, 166, 166)"  }, // Change border color to off-white
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#f5f5f5", 
                          },
                        }}
              />

              <StyledButton type="submit">
                {isLogin ? "Login" : "Sign Up"}
              </StyledButton>
            </form>

            <Typography
              sx={{ mt: 2, cursor: "pointer", color: "#ffdfdf" }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Typography>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Copyright Notice */}
      <Footer>© {new Date().getFullYear()} Reusable Tech Inventory. All Rights Reserved.</Footer>
    </Background>
  );
};

export default AuthPage;
