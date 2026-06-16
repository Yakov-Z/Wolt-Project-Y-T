import React, { useState, useEffect } from 'react';
import CustomButton from '../components/CustomButton';
import '../components/Navbar/navbar.css';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateRestaurantPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Flattened state for easier form management
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: '',
        street: '',
        number: '',
        latitude: '',
        longitude: '',
        category: '',
        kosher: false
    });
    
    const [imageText, setImageText] = useState('');
    const [logoText, setLogoText] = useState('');

    // States for loading, API errors, and validation errors
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                // Security check: Verify if the logged-in user is the actual owner
                const response = await fetch(`http://localhost:5000/api/restaurants/${id}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.owner && data.owner.id !== user.id) {
                        // Log for developers and alert the user
                        console.error("Unauthorized: User is not the owner of this restaurant");
                        alert("אין לך הרשאה לערוך את המסעדה הזו.");
                        
                        // Redirect the unauthorized user back to the restaurant page
                        navigate(`/restaurant/${id}`); 
                        return;
                    }
                    
                    // Populate form with existing data so the user can see their current details
                    setFormData({
                        name: data.name || '',
                        category: data.category || '',
                        description: data.description || '',
                        kosher: data.kosher || false,
                        city: data.address?.city || '',
                        street: data.address?.street || '',
                        number: data.address?.number || '',
                        latitude: data.address?.latitude || '',
                        longitude: data.address?.longitude || ''
                    });

                    // Set existing image and logo so they are not lost if not updated
                    setImageText(data.image || '');
                    setLogoText(data.logo || '');
                } else {
                    setError("Restaurant not found");
                }
            } catch (err) {
                console.error("Error fetching restaurant details", err);
                setError("Network error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurant();
    }, [id, user.id, navigate]);

    // Handle all generic input changes, including checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear the specific error when the user starts typing again
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageText(reader.result);
            };
            reader.readAsDataURL(file);
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoText(reader.result);
            };
            reader.readAsDataURL(file);
            if (errors.logo) {
                setErrors(prev => ({ ...prev, logo: null }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Repackage the payload to match the backend expectations
        const payload = {
            name: formData.name,
            description: formData.description,
            image: imageText,
            logo: logoText,
            address: {
                city: formData.city,
                street: formData.street,
                number: formData.number,
                latitude: formData.latitude,
                longitude: formData.longitude
            },
            category: formData.category,
            kosher: formData.kosher,
            owner: { 
                id: user.id 
            }
        };
        
        const token = localStorage.getItem('token');

        // If there's no token, we can't fetch protected data
        if (!token) {
            setError('No authentication token found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Handle validation errors from the server (status 400)
            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    console.error("General error:", data.message);
                }
                return;
            }

            // Redirect back to the restaurant page upon successful update
            navigate(`/restaurant/${id}`);

        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>טוען נתונים...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '1.2rem' }}>{error}</div>;

    // Reusable styles for consistency across all inputs
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' };
    const inputStyle = {
        width: '100%', 
        padding: '12px 15px', 
        boxSizing: 'border-box', 
        borderRadius: '8px', 
        border: '1px solid #ccc',
        fontFamily: 'inherit',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#fff'
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', direction: 'rtl' }}>
            <div style={{ 
                maxWidth: '700px', 
                margin: '0 auto', 
                backgroundColor: '#ffffff', 
                padding: '40px', 
                borderRadius: '16px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)' 
            }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2 style={{ color: '#2c3e50', fontSize: '2.2rem', margin: '0' }}>עדכון מסעדה</h2>
                    <p style={{ color: '#7f8c8d', marginTop: '10px' }}>ערוך את פרטי המסעדה שלך שיוצגו ללקוחות</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    
                    {/* Basic Info Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#34495e' }}>פרטים כלליים</h3>
                        
                        <div>
                            <label style={labelStyle}>שם המסעדה</label>
                            <input 
                                type="text"
                                name="name" 
                                placeholder="הכנס את שם המסעדה" 
                                value={formData.name} 
                                onChange={handleChange} 
                                style={inputStyle}
                            />
                            {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.name}</span>}
                        </div>

                        <div>
                            <label style={labelStyle}>קטגוריה</label>
                            <input 
                                type="text"
                                name="category" 
                                placeholder="למשל: איטלקי, סושי, בורגרים" 
                                value={formData.category} 
                                onChange={handleChange} 
                                style={inputStyle}
                            />
                            {errors.category && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.category}</span>}
                        </div>

                        <div>
                            <label style={labelStyle}>תיאור המסעדה</label>
                            <textarea 
                                name="description" 
                                placeholder="ספר ללקוחות מה מייחד אתכם..." 
                                value={formData.description} 
                                onChange={handleChange}
                                rows="5"
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                            {errors.description && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.description}</span>}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#34495e' }}>מיקום</h3>
                        
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '2 1 200px' }}>
                                <label style={labelStyle}>עיר</label>
                                <input type="text" name="city" placeholder="עיר" value={formData.city} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: '2 1 200px' }}>
                                <label style={labelStyle}>רחוב</label>
                                <input type="text" name="street" placeholder="רחוב" value={formData.street} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: '1 1 80px' }}>
                                <label style={labelStyle}>מספר</label>
                                <input type="text" name="number" placeholder="מס'" value={formData.number} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>קו רוחב (Latitude)</label>
                                <input type="text" name="latitude" placeholder="למשל: 32.0853" value={formData.latitude} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>קו אורך (Longitude)</label>
                                <input type="text" name="longitude" placeholder="למשל: 34.7818" value={formData.longitude} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Settings & Media Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#34495e' }}>הגדרות ותמונות</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                            <input 
                                type="checkbox" 
                                id="kosher" 
                                name="kosher" 
                                checked={formData.kosher} 
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                            />
                            <label htmlFor="kosher" style={{ fontWeight: 'bold', color: '#2c3e50', cursor: 'pointer', fontSize: '1.1rem' }}>
                                למסעדה יש תעודת כשרות
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={labelStyle}>תמונת נושא (Main Image)</label>
                                <div style={{ border: '1px dashed #adb5bd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
                                </div>
                                {errors.image && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.image}</span>}
                            </div>

                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={labelStyle}>לוגו המסעדה (Logo)</label>
                                <div style={{ border: '1px dashed #adb5bd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                                    <input type="file" accept="image/*" onChange={handleLogoChange} style={{ width: '100%' }} />
                                </div>
                                {errors.logo && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.logo}</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <CustomButton onClickHandler={handleSubmit} colorId="1" text="שמור שינויים" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateRestaurantPage;