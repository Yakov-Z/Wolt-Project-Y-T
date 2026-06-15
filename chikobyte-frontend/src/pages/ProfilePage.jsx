import React, { useState, useEffect } from 'react';
import UserDetailItem from '../components/DetailsItem'; 

export default function ProfilePage({ user }) {
    // State to hold the fresh data from the server
    const [fullUserData, setFullUserData] = useState(null);
    
    // State for loading UI
    const [isLoading, setIsLoading] = useState(true);
    // State for error handling
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchUserDetails = async () => {
            // Retrieve the JWT token from local storage
            const token = localStorage.getItem('token');

            // If there's no token, we can't fetch protected data
            if (!token) {
                setError('No authentication token found. Please log in.');
                setIsLoading(false);
                return;
            }
            

            try {
                // Send a GET request to the backend with the token in the headers
                const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // This is the crucial part for authentication
                        'Authorization': `Bearer ${token}` 
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Update state with the fresh data directly from the database
                    setFullUserData(data);
                } else {
                    setError(data.error || 'Failed to fetch user details');
                }
            } catch (err) {
                console.error("The REAL error is:", err);
                setError('Network error occurred while fetching data');
            } finally {
                // Turn off the loading indicator regardless of success or failure
                setIsLoading(false);
            }
        };

        // Execute the function
        fetchUserDetails();
    }, []); 

    // Render loading state while waiting for the server
    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile data...</div>;
    }
    
    // Render error state if something went wrong
    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    }
    
    // Render the actual profile using the fresh data
    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>הפרופיל שלי</h2>
            
            {/* מיכל ממורכז עבור התמונה */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                {fullUserData.image ? (
                    <img 
                        src={fullUserData.image} 
                        alt="תמונת פרופיל" 
                        style={{ 
                            width: '150px', 
                            height: '150px', 
                            borderRadius: '50%', // הופך את התמונה לעיגול
                            objectFit: 'cover', // מוודא שהתמונה ממלאת את העיגול בלי להתעוות
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // צל עדין
                            border: '3px solid #fff' // מסגרת לבנה קטנה
                        }}
                    />
                ) : (
                    // עיצוב למקרה שאין תמונה
                    <div style={{ 
                        width: '150px', 
                        height: '150px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e9ecef', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#6c757d',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}>
                        אין תמונה
                    </div>
                )}
            </div>
            
            <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '25px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <UserDetailItem  label="שם מלא" value={fullUserData.realname} />
                <UserDetailItem  label="דואר אלקטרוני" value={fullUserData.mail} />
                <UserDetailItem  label="מספר טלפון" value={fullUserData.phonenumber} />
                <UserDetailItem  label="שם משתמש" value={fullUserData.username} />
                <UserDetailItem  label="סוג לקוח" value={fullUserData.isadmin ? 'מסעדן' : 'משתמש רגיל'} />

                {/* Assuming the backend returns the address object completely */}
                {fullUserData.address && (
                    <UserDetailItem 
                        label="כתובת מגורים" 
                        value={`${fullUserData.address.street} ${fullUserData.address.number}, ${fullUserData.address.city}`} 
                    />
                )}
            </div>
        </div>
    );
}