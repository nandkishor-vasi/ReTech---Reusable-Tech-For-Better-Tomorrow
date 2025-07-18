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
    const { beneficiaryId } = useParams();
    const navigate = useNavigate();
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
            console.log("Fetching requests for beneficiary ID:", beneficiaryId);
            console.log("Using token:", token);
            
            const acceptedRes = await axios.get(`${backendBaseUrl}/api/request/beneficiary/${beneficiaryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setAcceptedRequests(acceptedRes.data);
        } catch (error) {
            console.error("Error fetching requests:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    

  

    if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: "#007bff" }}>
                📩 Manage Requests
            </Typography>

            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: "#388e3c" }}> Requests</Typography>
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
                                    <TableCell><b>Accepted By</b></TableCell>
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
                                            <TableCell>{req.donor?.user?.name || "Unknown"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<CheckCircle />} 
                                                    label={req.status} 
                                                    color={req.status === "Accepted" ? "success" : "warning"}
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
