import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import '../styles/AccountInfo.css';
const AccountInfo = () => {
    const { user_id } = useAuth();
    console.log(`Current user ID: ${user_id}`);
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            console.log(`Making request to fetch user data for ID: ${user_id}`);
            try {
                const response = await axios.get(`https://cache-corner.onrender.com/api/users/${user_id}`);
                console.log(`Fetched user data: `, response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (!isNaN(user_id)) {
            fetchUserData();
        }
    }, [user_id]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await axios.put(`https://cache-corner.onrender.com/api/users/${user_id}`, userData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div className="account-info-container">
            {isEditing ? (
                <div>
                    <input type="email" name="email" value={userData.email || ''} onChange={handleChange} placeholder="Email" />
                    <input type="password" name="password" value={userData.password || ''} onChange={handleChange} placeholder="Password" />
                    <input type="text" name="first_name" value={userData.first_name || ''} onChange={handleChange} placeholder="First Name" />
                    <input type="text" name="last_name" value={userData.last_name || ''} onChange={handleChange} placeholder="Last Name" />
                    <input type="text" name="phone" value={userData.phone || ''} onChange={handleChange} placeholder="Phone" />
                    <input type="text" name="address" value={userData.address || ''} onChange={handleChange} placeholder="Address" />
                    <input type="text" name="addressLine2" value={userData.addressLine2 || ''} onChange={handleChange} placeholder="Address Line 2" />
                    <input type="text" name="city" value={userData.city || ''} onChange={handleChange} placeholder="City" />
                    <input type="text" name="state" value={userData.state || ''} onChange={handleChange} placeholder="State" />
                    <input type="text" name="zip" value={userData.zip || ''} onChange={handleChange} placeholder="ZIP Code" />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p>Email: {userData.email}</p>
                    <p>First Name: {userData.first_name}</p>
                    <p>Last Name: {userData.last_name}</p>
                    <p>Phone: {userData.phone}</p>
                    <p>Address: {userData.address}</p>
                    <p>Address Line 2: {userData.addressLine2}</p>
                    <p>City: {userData.city}</p>
                    <p>State: {userData.state}</p>
                    <p>ZIP Code: {userData.zip}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default AccountInfo;