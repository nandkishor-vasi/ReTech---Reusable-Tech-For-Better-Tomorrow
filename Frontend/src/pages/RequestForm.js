import React,{useState} from "react";
import axios from "axios";
import "../styles/RequestForm.css";
import { TextField } from "@mui/material";
import { DeviceHub } from "@mui/icons-material";

const RequestForm = ({beneficiaryId, onSuccess}) => {
    const [request, setRequest] = useState({
        deviceName:"",
        description:"",
        createdAt: new Date().toISOString().split('T')[0],
    })
    
    const[messages, setMessages] = useState("");
    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData;
    const backendUrl = "http://localhost:8080";


    const handleChange =(e) =>{
        setRequest({
            ...request,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessages("");

        if(!beneficiaryId || !token){
            setMessages("Missing beneficiary id or token");
            setLoading(false);
            return;
        }

        try {
            const reponse = await axios.post(`${backendUrl}/api/request/beneficiary/${beneficiaryId}`, {...request}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessages("Request made successfully");
            setRequest({
                deviceName:"",
                description:"",
                createdAt: new Date().toISOString().split('T')[0],
            });

            if(onSuccess) onSuccess();
            
        } catch (error) {
            console.error("Error making request:", error.response?.data || error.message);
            setMessages("Error making request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="request-form">
            <h2>Make a Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                {/* Device Name */}
                    <TextField
                        fullWidth
                        label="Device Name"
                        name="deviceName"
                        value={request.deviceName}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: <DeviceHub color="primary" sx={{ mr: 1 }} />,
                            }}
                    />
                    <label>Description</label>
                    
                    <textarea 
                        name="description" 
                        value={request.description} 
                        onChange={handleChange}
                        placeholder="Describe the request..."
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Submit Request"}
                    </button>
                </div>
                {messages && <div className="messages">{messages}</div>}
            </form>
        </div>
    );

}

export default RequestForm;