import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    Container, Card, CardContent, Typography, Button, List, ListItem, ListItemText, 
    Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Grid, Box, CardActionArea, Divider
} from "@mui/material";
import { Person, CheckCircle, PendingActions, Inventory } from "@mui/icons-material";
import RequestForm from "./RequestForm";
import BeneficiaryHistory from "./BeneficiaryHistory";
import ParallaxHero from "../components/ParallaxHero";
import ParallaxPage from "../components/ParallaxPage";
import { History } from "@mui/icons-material";

const BeneficiaryDashboard = () => {
    const { beneficiaryId } = useParams();
    const navigate = useNavigate();
    const [history, setBeneficiaryHistory] = useState([]);
    const [beneficiary, setBeneficiary] = useState(null);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateHistory, setUpdateHistory] = useState(false); 
    const [updateRequests, setUpdateRequests] = useState(false);

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const token = userData?.token;
    const backendBaseUrl = "http://localhost:8080";

    useEffect(() => {
        const fetchBeneficiaryDetails = async () => {
            if (!beneficiaryId || !token) return;

            try {
                const [beneficiaryResponse, requestResponse] = await Promise.all([
                    axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${backendBaseUrl}/api/request/beneficiary/${beneficiaryId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setBeneficiary(beneficiaryResponse.data);
                setRequests(requestResponse.data);
            } catch (error) {
                console.error("Error fetching beneficiary details:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBeneficiaryDetails();
        fetchAvailableDevices();
        fetchBeneficiaryHistory();
    }, [beneficiaryId, token, updateRequests]);

    const handleRequestSuccess = () => {
        setUpdateRequests((prev) => !prev); 
    };

    const fetchBeneficiaryHistory = async () => {
                if (!beneficiaryId || !token) {
                    setLoading(false);
                    return;
                }
    
                try {
                    console.log("In Beneficiary History") 
                    const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}/history`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setBeneficiaryHistory(response.data);
                } catch (err) {
                    console.error("Error fetching beneficiary history:", err.response?.data || err.message);
                } finally {
                    setLoading(false);
                }
    };

    const fetchAvailableDevices = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/api/devices/available`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableDevices(response.data);
        } catch (error) {
            console.error("Error fetching available devices:", error.response?.data || error.message);
        }
    };

    const handleAcceptDevice = async (deviceId) => {
        try {
            await axios.put(`${backendBaseUrl}/api/devices/${deviceId}/beneficiaries/${beneficiaryId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAvailableDevices();
            setUpdateHistory(prev => !prev);
        } catch (error) {
            console.error("Error accepting device:", error.response?.data || error.message);
        }
    };

    if (loading) return <CircularProgress style={{ margin: "50px auto", display: "block" }} />;

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                overflow: "hidden",
                backgroundColor: "#0a192f",
                color: "#fff"
            }}
        > 
            <ParallaxHero text="Empowering lives," subText="one step at a time" />
            <Container maxWidth="lg" sx={{ mt: 4, position: "relative", zIndex: 1 }}>
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: "#007bff", textShadow: "2px 0px 2px rgba(255, 255, 255, 0.84)" }}>
                    🎁 Beneficiary Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3, background: "rgba(255, 255, 255, 0.9)" }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Person fontSize="large" color="primary" />
                                <Typography variant="h6">Welcome, {beneficiary?.user?.username || "Beneficiary"}!</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%", background: "rgba(255, 255, 255, 0.9)", paddingLeft:"19px", paddingRight: "22px", paddingTop:"11px", paddingBottom: "7px"}}>
                            <CardActionArea onClick={() => navigate(`/requests/beneficiary/${beneficiaryId}`)}>
                                <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>📩 Your Requests</Typography>
                                {requests.length > 0 ? (
                                    <List>
                                        {requests.map((request) => (
                                            <ListItem key={request.id} sx={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 2, mb: 1 }}>
                                                <ListItemText primary={request.deviceName} />
                                                <Chip
                                                    icon={request.status === "Pending" ? <PendingActions /> : <CheckCircle />}
                                                    label={request.status}
                                                    color={request.status === "Pending" ? "warning" : "success"}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="textSecondary">No requests found.</Typography>
                                )}
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%", background: "rgba(255, 255, 255, 0.9)" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>🖥️ Available Devices</Typography>
                                <Button variant="contained" color="primary" fullWidth onClick={fetchAvailableDevices} sx={{ mb: 2 }}>
                                    Fetch Available Devices
                                </Button>
                                {availableDevices.length > 0 ? (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><b>Device Name</b></TableCell>
                                                    <TableCell><b>Type</b></TableCell>
                                                    <TableCell><b>Condition</b></TableCell>
                                                    <TableCell><b>Action</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {availableDevices.map((device) => (
                                                    <TableRow key={device.id}>
                                                        <TableCell>{device.name}</TableCell>
                                                        <TableCell>{device.type}</TableCell>
                                                        <TableCell>{device.condition}</TableCell>
                                                        <TableCell>
                                                            <Button variant="contained" color="success" onClick={() => handleAcceptDevice(device.id)}>
                                                                Accept
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Inventory color="disabled" /> No available devices.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3, background: "rgba(255, 255, 255, 0.9)" }}>
                            <CardActionArea onClick={() => navigate(`/beneficiaryHistory/${beneficiaryId}`)} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5", display: "flex", alignItems: "center", gap: 1 }}>
                                    <History color="primary" /> 📜 Accepted Devices History
                                </Typography>
                                {history.length > 0 ? (
                                    <List>
                                        {history.slice(0, 3).map((device, index) => ( 
                                            <React.Fragment key={device.id}>
                                                <ListItem sx={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 2, mb: 1 }}>
                                                    <ListItemText primary={device.name} secondary={`Type: ${device.type} | Condition: ${device.condition}`} />
                                                </ListItem>
                                                {index !== history.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="textSecondary">No devices accepted yet.</Typography>
                                )}
                            </CardActionArea>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <RequestForm beneficiaryId={beneficiaryId} onSuccess={handleRequestSuccess}/>
                    </Grid>

                </Grid>

            </Container>
        </Box>
    );
};

export default BeneficiaryDashboard;
