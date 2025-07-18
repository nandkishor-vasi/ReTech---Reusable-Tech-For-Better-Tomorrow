import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    Container, Card, CardContent, Typography, Button, Chip, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box
} from "@mui/material";
import { CheckCircle, PendingActions, Inbox } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Requests = () => {
    const { donorId } = useParams();
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const token = user?.token || " ";
    console.log("token in requests : ", token);
    const backendBaseUrl = "http://localhost:8080";

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            console.log("Fetching requests for donor ID:", donorId);
            console.log("Using token:", token);
            const [pendingRes, acceptedRes] = await Promise.all([
                axios.get(`${backendBaseUrl}/api/request/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${backendBaseUrl}/api/request/donor/${donorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setPendingRequests(pendingRes.data);
            setAcceptedRequests(acceptedRes.data);
        } catch (error) {
            console.error("Error fetching requests:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`${backendBaseUrl}/api/request/${requestId}/donor/${donorId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchRequests();

        } catch (error) {
            console.error("Error accepting request:", error.response?.data || error.message);
        }
    };


    if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: "#007bff" }}>
                📩 Manage Requests
            </Typography>

            <Card sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: "#d32f2f" }}>⏳ Pending Requests</Typography>
                    {pendingRequests.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Request ID</b></TableCell>
                                        <TableCell><b>Beneficiary Name</b></TableCell>
                                        <TableCell><b>Device Name</b></TableCell>
                                        <TableCell><b>Status</b></TableCell>
                                        <TableCell><b>Action</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendingRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>{req.id}</TableCell>
                                            <TableCell>{req.beneficiaryName || "N/A"}</TableCell>
                                            <TableCell>{req.deviceName || "N/A"}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    icon={<PendingActions />} 
                                                    label={req.status} 
                                                    color="warning"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {req.status === "Pending" && (
                                                    <Button variant="contained" color="success" onClick={() => handleAcceptRequest(req.id)}>
                                                        Accept
                                                    </Button>
                                                )}
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Inbox color="disabled" /> No pending requests.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: "#388e3c" }}>✅ Accepted Requests</Typography>
                    {acceptedRequests.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                    <TableCell><b>Request ID</b></TableCell>
                                    <TableCell><b>Beneficiary Name</b></TableCell>
                                    <TableCell><b>Device Name</b></TableCell>
                                    <TableCell><b>Description</b></TableCell>
                                    <TableCell><b>Accepted Date</b></TableCell>
                                    <TableCell><b>Status</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {acceptedRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>{req.id}</TableCell>
                                            <TableCell>{req.beneficiaryName || "N/A"}</TableCell>
                                            <TableCell>{req.deviceName || "N/A"}</TableCell>
                                            <TableCell>{req.description}</TableCell>
                                            <TableCell>{new Date(req.acceptedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<CheckCircle />} 
                                                    label={req.status} 
                                                    color="success"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography color="textSecondary">No accepted requests yet.</Typography>
                    )}
                </CardContent>
            </Card>

            <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                    🔙 Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default Requests;
