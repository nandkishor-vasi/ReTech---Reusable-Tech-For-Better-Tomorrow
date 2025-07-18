import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Avatar, 
    CircularProgress, Container, Box, Button } from "@mui/material";
import { PendingActions, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const DonorDonations = () => {
    const { donorId } = useParams();
    const navigate = useNavigate(); 
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} =useAuth();
    const token = user?.token || " ";
    console.log("token in donations : ", token);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/devices/donors/${donorId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setDevices(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching devices:", error);
                setLoading(false);
            });
    }, [donorId,token]);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", textAlign: "center" }}>
                📦 Your Donations
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : devices.length > 0 ? (
                <List>
                    {devices.map((device) => (
                        <Card key={device.id} sx={{ mb: 2, boxShadow: 3 }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar
                                    variant="rounded"
                                    src={device.deviceImageUrl || "https://via.placeholder.com/100"}
                                    sx={{ width: 80, height: 80 }}
                                />
                                <ListItemText
                                    primary={`${device.name || "Unknown"} - ${device.type || "Unknown"} (${device.condition || "Unknown"})`}
                                    secondary={
                                        <>
                                            {`Donated on: ${new Date(device.donationDate).toLocaleDateString()}`}
                                            {device.acceptedDate && <br />}
                                            {device.acceptedDate && `Accepted on: ${new Date(device.acceptedDate).toLocaleDateString()}`}
                                            {device.beneficiary?.user?.name && <br />}
                                            {device.beneficiary?.user?.name && `Beneficiary: ${device.beneficiary.user.name}`}        
                                        </>
                                    }
                                    
                                />
                                <Chip
                                    icon={device.status === "Pending" ? <PendingActions /> : <CheckCircle />}
                                    label={device.status || "Unknown"}
                                    color={device.status === "Pending" ? "warning" : "success"}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </List>
            ) : (
                <Typography color="textSecondary" sx={{ textAlign: "center" }}>
                    No devices donated yet.
                </Typography>
            )}
            <Box mt={3} display="flex" justifyContent="center">
                <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                    🔙 Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default DonorDonations;
