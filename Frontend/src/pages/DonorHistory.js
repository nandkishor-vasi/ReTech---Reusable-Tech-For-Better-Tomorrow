import React, {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const DonorHistory = () => {
    const {donorId} = useParams();
    const [donorHistory, setDonorHistory] = useState([]);

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData;
    const backendBaseUrl = 'http://localhost:8080';
    const donorHistoryUrl = `${backendBaseUrl}/api/donors/${donorId}/history`;

    const fetchDonorHistory = async () => {
        try {
            const response = await axios.get(donorHistoryUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Donor History:", response.data);
            setDonorHistory(response.data);
        } catch (error) {
            console.error('Error fetching donor history:', error.response?.data || error.message);
        }
    }

    useEffect(() => {
        const interval = setInterval(fetchDonorHistory, 10000);  

        return () => clearInterval(interval);

    }, [donorId, token]);

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
        <div className="donor-history">
            <h1>Donor History</h1>
            <table>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Beneficiary Name</th>
                        <th>Device Name</th>
                        <th>Accepted Date</th>
                    </tr>
                </thead>
                <tbody>
                    {donorHistory.map((historyItem, index) => (
                        <tr key={index}>
                            <td>{historyItem.requestId}</td>
                            <td>{historyItem.beneficiaryName}</td>
                            <td>{historyItem.deviceName}</td>
                            <td>{formatAcceptedDate(historyItem.acceptedDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
}

export default DonorHistory;