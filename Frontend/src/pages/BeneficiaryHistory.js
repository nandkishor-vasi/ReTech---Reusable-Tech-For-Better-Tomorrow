import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Divider, CircularProgress, 
    Box, IconButton, Tooltip, Avatar
} from "@mui/material";
import { ArrowBack, History, ErrorOutline } from "@mui/icons-material";
import {useAuth} from "../context/AuthContext";

const BeneficiaryHistory = ({ updateTrigger }) => {
    const { beneficiaryId } = useParams();
    const navigate = useNavigate();
    const [history, setBeneficiaryHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {user} = useAuth();
    const token = user?.token;    
    const backendBaseUrl = "http://localhost:8080";
    console.log("token in history: " , token);

    useEffect(() => {
        const fetchBeneficiaryHistory = async () => {
            if (!beneficiaryId || !token) {
                setError("Missing beneficiary ID or authentication token.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBeneficiaryHistory(response.data);
            } catch (err) {
                setError("Failed to load history. Please try again later.");
                console.error("Error fetching beneficiary history:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBeneficiaryHistory();
    }, [beneficiaryId, token, updateTrigger]);

    const formatAcceptedDate = (dateString) => {
        if (!dateString) return "Unknown";
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate.getTime())) return "Invalid Date";

        return parsedDate.toLocaleString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Kolkata"
        }) + " IST";
    };

    return (
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, background: "rgba(255, 255, 255, 0.9)" }}>
                    <CardContent>
                        {/* Header with Back Button */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Tooltip title="Go Back">
                                    <IconButton onClick={() => navigate(-1)} color="primary">
                                        <ArrowBack />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="h6" color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <History /> 📜 Accepted Devices History
                                </Typography>
                            </Box>
                        </Box>

                        {/* Loading Indicator */}
                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={3}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" color="error.main">
                                <ErrorOutline sx={{ fontSize: 40, mb: 1 }} />
                                <Typography>{error}</Typography>
                            </Box>
                        ) : history.length > 0 ? (
                            <List>
                                {history.map((device, index) => (
                                    <React.Fragment key={device.id}>
                                        <ListItem sx={{ background: "#f5f5f5", borderRadius: 2, mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
                                            {/* Device Image */}
                                            <Avatar 
                                                src={device.deviceImageUrl} 
                                                alt={device.name} 
                                                sx={{ width: 60, height: 60, borderRadius: 2 }}
                                            />

                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight="bold">
                                                        {device.name} - {device.type} ({device.condition})
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Donor: <strong>{device.donorName || "Unknown"}</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Accepted on: {formatAcceptedDate(device.acceptedDate)}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index !== history.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary" textAlign="center">No devices accepted yet.</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default BeneficiaryHistory;
