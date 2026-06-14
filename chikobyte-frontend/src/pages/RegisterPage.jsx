import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import '../components/Navbar/navbar.css';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        realname: '',
        phonenumber: '',
        mail: '',
        image: '',
        city: '',
        street: '',
        number: '',
        latitude: '',
        longitude: ''
    });

    // state to hold errors returned from the server
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // update the relevant field in the state when the user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // clear the specific error when the user starts typing again
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async () => {
        const payload = {
                username: formData.username,
                password: formData.password,
                realname: formData.realname,
                phonenumber: formData.phonenumber,
                mail: formData.mail,
                image: formData.image,
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

        // handle validation errors from the server (status 400)
        if (!response.ok) {
            if (data.errors) {
                // map the server errors to our local state to display under the inputs
                setErrors(data.errors);
            } else {
                console.error("General error:", data.message);
            }
            return; // stop execution if there are errors
        }

        localStorage.setItem('token', data.token);

        navigate('/'); // redirect to home page after successful registration        
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

{errors.isadmin && (
    <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px' }}>
        {errors.isadmin}
    </div>
)}
            <InputBox 
                name="image"
                text="תמונה:"
                inputValue={formData.image}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.image} 
            />

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