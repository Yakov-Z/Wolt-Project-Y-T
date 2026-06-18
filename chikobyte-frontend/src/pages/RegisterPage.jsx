import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import '../components/Navbar/navbar.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '', 
        realname: '',
        phonenumber: '',
        mail: '',
        isadmin: false,
        city: '',
        street: '',
        number: '',
        latitude: '',
        longitude: ''
    });
    const [imageText, setImageText] = useState('');

    // State to hold errors returned from the server or local validation
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Update the relevant field in the state when the user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear the specific error when the user starts typing again
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (event) => {
        // Get the first file that the user selected from their computer
        const file = event.target.files[0];

        if (file) {
            // Create a built-in browser object designed to read files
            const reader = new FileReader();

            // Define what happens asynchronously WHEN the browser finishes reading the file
            reader.onloadend = () => {
                // Save the long text string (the result) into our state
                setImageText(reader.result);
            };

            // Tell the reader to start reading the file and convert it to a text URL (Base64)
            reader.readAsDataURL(file);

            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const handleSubmit = async () => {
        // Local validation: Check if passwords match before sending to the server
        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: 'הסיסמאות אינן תואמות'
            }));
            return; // Stop execution if passwords do not match
        }

        // Prepare the payload (omitting confirmPassword as the server doesn't need it)
        const payload = {
            username: formData.username,
            password: formData.password,
            realname: formData.realname,
            phonenumber: formData.phonenumber,
            mail: formData.mail,
            image: imageText,
            isadmin: formData.isadmin,
            address: {
                city: formData.city,
                street: formData.street,
                number: formData.number,
                latitude: formData.latitude,
                longitude: formData.longitude
            }
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Handle validation errors from the server (status 400)
            if (!response.ok) {
                if (data.errors) {
                    // Map the server errors to our local state to display under the inputs
                    setErrors(data.errors);
                } else {
                    console.error("General error:", data.message);
                }
                return; // Stop execution if there are errors
            }

            navigate('/'); // Redirect to home page after successful registration        
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="container mt-2" style={{ maxWidth: '400px' }}>
            <div className="mx-auto" style={{ width: '60%' }}>
                <h2 className="brand-name-big">Chikobyte</h2>
            </div>
            <h2 className="mb-4 text-center">פתח חשבון חדש ב-Chikobyte</h2>
            
            <InputBox 
                name="username"
                text="שם משתמש:"
                inputValue={formData.username}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.username} 
            />
            <InputBox 
                name="password"
                text="סיסמה:"
                inputValue={formData.password}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.password} 
            />
            {/* New Confirm Password InputBox */}
            <InputBox 
                name="confirmPassword"
                text="וידוא סיסמה:"
                inputValue={formData.confirmPassword}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.confirmPassword} 
            />

            <InputBox 
                name="realname"
                text="שם מלא:"
                inputValue={formData.realname}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.realname} 
            />
            <InputBox 
                name="phonenumber"
                text="מספר טלפון:"
                inputValue={formData.phonenumber}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.phonenumber} 
            />
            <InputBox 
                name="mail"
                text="דואר אלקטרוני:" 
                inputValue={formData.mail}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.mail} 
            />

            <div className="mb-3" style={{ display: 'flex', alignItems: 'center', direction: 'rtl' }}>
                <input 
                    type="checkbox" 
                    name="isadmin" 
                    checked={formData.isadmin || false} 
                    onChange={(e) => handleChange({ 
                        target: { 
                            name: 'isadmin', 
                            value: e.target.checked 
                        } 
                    })} 
                    style={{ width: '18px', height: '18px', marginLeft: '10px' }}
                />
                <label style={{ margin: 0, fontWeight: 'bold' }}>מסעדנ/ית?</label>
            </div>

            <div className="mb-3">
                {/* The Input Group to match the gray label box style */}
                <div style={{ display: 'flex', direction: 'rtl', border: '1px solid #ced4da', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '0.375rem 0.75rem', 
                        borderLeft: '1px solid #ced4da',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%', // Match the width of your other labels
                        color: '#495057'
                    }}>
                        תמונה:
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ 
                            flex: 1, 
                            padding: '0.375rem 0.75rem',
                            border: 'none',
                            outline: 'none',
                            direction: 'ltr' // Keeps the "Choose File" text looking standard
                        }} 
                    />
                </div>

                {errors.image && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '10px',
                        borderRadius: '0.375rem',
                        textAlign: 'center',
                        marginTop: '10px',
                        border: '1px solid #f5c2c7'
                    }}>
                        {errors.image}
                    </div>
                )}
            </div>

            <h7 className="text-right">כתובת:</h7>

            <InputBox 
                name="city"
                text="עיר:"
                inputValue={formData.city}
                onInputChange={handleChange}
                size={2}
            />
            <InputBox 
                name="street"
                text="רחוב:"
                inputValue={formData.street}
                onInputChange={handleChange}
                size={2}
            />
            <InputBox 
                name="number"
                text="מספר בית:"
                inputValue={formData.number}
                onInputChange={handleChange}
                size={2}
            />
            <InputBox 
                name="longitude"
                text="קו אורך:"
                inputValue={formData.longitude}
                onInputChange={handleChange}
                size={2}
            />
            <InputBox 
                name="latitude"
                text="קו רוחב:"
                inputValue={formData.latitude}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.address} 
            />

            <div className="mx-auto" style={{ width: '30%' }}>
                <CustomButton
                    text="הרשם"
                    colorId='1'
                    onClickHandler={handleSubmit}
                />
            </div>
        </div>
    );
}

export default RegisterPage;