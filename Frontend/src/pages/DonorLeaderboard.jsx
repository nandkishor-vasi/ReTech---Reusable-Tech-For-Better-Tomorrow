import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, CircularProgress, Box, Card, CardContent, Avatar
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const DonorLeaderboard = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {user } = useAuth();
  const id = user?.id;
  const token = user?.token;

  const backendBaseUrl = "http://localhost:8080";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/donation/leaderboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDonors(response.data);
      } catch (err) {
        setError("Failed to load leaderboard. Please try again.");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, background: "rgba(255, 255, 255, 0.95)", mt: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <EmojiEvents color="primary" />
          <Typography variant="h6" color="primary">🏆 Donor Leaderboard</Typography>
        </Box>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto" }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : donors.length > 0 ? (
          <TableContainer component={Paper} sx={{ background: "transparent" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>🏅 Rank</b></TableCell>
                  <TableCell><b>👤 Donor Name</b></TableCell>
                  <TableCell><b>📦 Total Devices Donated</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donors.map((donor, index) => (
                  <TableRow 
                    key={donor.donorId} 
                    sx={{
                      background: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : index === 2 ? "#cd7f32" : "transparent",
                      color: index < 3 ? "#fff" : "inherit",
                      fontWeight: index < 3 ? "bold" : "normal"
                    }}
                  >
                    <TableCell>
                      <Avatar sx={{ bgcolor: "transparent", fontSize: "1.5rem" }}>
                        {getRankIcon(donor.rank)}
                      </Avatar>
                    </TableCell>

                    <TableCell>{donor.donorName}</TableCell>
                    <TableCell>{donor.totalDevicesDonated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="textSecondary">No donors found.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DonorLeaderboard;
