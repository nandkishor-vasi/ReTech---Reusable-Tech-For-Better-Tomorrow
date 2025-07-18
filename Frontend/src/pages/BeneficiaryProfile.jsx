import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const BeneficiaryProfile = () => {
    const { user } = useAuth();
    const beneficiaryId = user?.id;
    const token = user?.token;
    const backendBaseUrl = "http://localhost:8080";

    const [profile, setProfile] = useState({
        profileImageUrl: "",
        city: "",
        state: "",
        country: "",
        donationsReceived: 0,
        beneficiaryType: "",
        status: "",
        needDescription: "",
        joinedAt: "",
    });

    const [editing, setEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (beneficiaryId) {
            fetchBeneficiaryProfile();
        }
    }, [beneficiaryId]);

    const fetchBeneficiaryProfile = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/api/beneficiary/${beneficiaryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("Failed to fetch profile.");
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const formatDate = (dateArray) => {
        if (!dateArray) return "N/A";
        const [year, month, day, hour, minute] = dateArray;
        return new Date(year, month - 1, day, hour, minute).toLocaleString();
    };

    return (
        <div className="profile-container">
            <h2 className="profile-header">Beneficiary Profile</h2>
            <div className="profile-card">
                <div className="profile-image-section">
                    <img
                        src={profile.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                        alt="Profile"
                        className="profile-image"
                    />
                    {editing && (
                        <input type="file" className="file-input" onChange={handleFileChange} />
                    )}
                </div>
                <div className="profile-info">
                    <p><FaUser /> <strong>Name:</strong> {user?.name}</p>
                    <p><FaEnvelope /> <strong>Email:</strong> {user?.email}</p>
                    <p><FaPhone /> <strong>Phone:</strong> {user?.phoneNumber}</p>
                    <p><FaCalendarAlt /> <strong>Joined On:</strong> {formatDate(profile.joinedAt)}</p>
                </div>
            </div>

            <div className="profile-form">
                <div className="input-group">
                    <label><FaMapMarkerAlt /> City:</label>
                    <input type="text" name="city" value={profile.city} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="input-group">
                    <label>State:</label>
                    <input type="text" name="state" value={profile.state} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="input-group">
                    <label>Country:</label>
                    <input type="text" name="country" value={profile.country} onChange={handleChange} disabled={!editing} />
                </div>
                <div className="input-group">
                    <label>Donations Received:</label>
                    <input type="number" name="donationsReceived" value={profile.donationsReceived} disabled />
                </div>
                <div className="input-group">
                    <label>Beneficiary Type:</label>
                    <select name="beneficiaryType" value={profile.beneficiaryType} onChange={handleChange} disabled={!editing}>
                        <option value="">Select Beneficiary Type</option>
                        <option value="INDIVIDUAL">INDIVIDUAL</option>
                        <option value="ORGANIZATION">ORGANIZATION</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Beneficiary Status:</label>
                    <select name="status" value={profile.status} onChange={handleChange} disabled={!editing}>
                        <option value="">Select Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Description:</label>
                    <textarea name="needDescription" value={profile.needDescription} onChange={handleChange} disabled={!editing}></textarea>
                </div>
            </div>

            <div className="button-group">
                {editing ? (
                    <>
                        <button className="save-button" onClick={() => setEditing(false)}>SAVE</button>
                        <button className="cancel-button" onClick={() => setEditing(false)}>CANCEL</button>
                    </>
                ) : (
                    <button className="edit-button" onClick={() => setEditing(true)}>EDIT PROFILE</button>
                )}
            </div>
        </div>
    );
};

export default BeneficiaryProfile;
