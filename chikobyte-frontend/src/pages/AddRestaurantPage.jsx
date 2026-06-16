import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import '../components/Navbar/navbar.css';
import { useNavigate } from 'react-router-dom';


function AddRestaurantPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        owner: '',
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

    const handleFileChange = (event) => {
        // Line 1: Get the first file that the user selected from their computer
        const file = event.target.files[0];

        if (file) {
            // Line 2: Create a built-in browser object designed to read files
            const reader = new FileReader();

            // Line 3: Define what happens asynchronousely WHEN the browser finishes reading the file
            reader.onloadend = () => {
                // Line 4: Save the long text string (the result) into our state
                setImageText(reader.result);
            };

            // Line 5: Tell the reader to start reading the file and convert it to a text URL (Base64)
            reader.readAsDataURL(file);

            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const handleLogoChange = (event) => {
        // Line 1: Get the first file that the user selected from their computer
        const file = event.target.files[0];

        if (file) {
            // Line 2: Create a built-in browser object designed to read files
            const reader = new FileReader();

            // Line 3: Define what happens asynchronousely WHEN the browser finishes reading the file
            reader.onloadend = () => {
                // Line 4: Save the long text string (the result) into our state
                setLogoText(reader.result);
            };

            // Line 5: Tell the reader to start reading the file and convert it to a text URL (Base64)
            reader.readAsDataURL(file);

            if (errors.logo) {
                setErrors(prev => ({ ...prev, logo: null }));
            }
        }
    };

    const handleSubmit = async () => {
        const payload = {
                name: formData.name,
                description: formData.description,
                image: imageText,
                logo: logoText,
                owner: JSON.parse(localStorage.getItem('user')),
                address: {
                    city: formData.city,
                    street: formData.street,
                    number: formData.number,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                },
                category: formData.category,
                logo: logoText,
                kosher: formData.kosher
            };
            const token = localStorage.getItem('token');

        // If there's no token, we can't fetch protected data
        if (!token) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/restaurants/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

        navigate('/'); // redirect to home page after successful creation       
    } catch (error) {
        console.error('Error during creation:', error);
        }
    };

    return (
        <div className="container mt-2" style={{ maxWidth: '400px' }}>
            <div className="mx-auto" style={{ width: '60%' }}>
            <h2 className="brand-name-big">Chikobyte</h2>
            </div>
            <h2 className="mb-4 text-center">זה הזמן שלך לכבוש את הארץ! הוסף את המסעדה החדשה שלך:</h2>
            
            <InputBox 
                name="name"
                text="שם מסעדה:"
                inputValue={formData.name}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.name} 
            />
            <InputBox 
                name="description"
                text="תיאור מסעדה:"
                inputValue={formData.description}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.description} 
            />

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
            לוגו:
        </div>
        <input 
            type="file" 
            accept="image/*" 
            onChange={handleLogoChange} 
            style={{ 
                flex: 1, 
                padding: '0.375rem 0.75rem',
                border: 'none',
                outline: 'none',
                direction: 'ltr' // Keeps the "Choose File" text looking standard
            }} 
        />
    </div>

    {errors.logo && (
        <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '0.375rem',
            textAlign: 'center',
            marginTop: '10px',
            border: '1px solid #f5c2c7'
        }}>
            {errors.logo}
        </div>
    )}
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
            <InputBox 
                name="category"
                text="קטגוריה:"
                inputValue={formData.category}
                onInputChange={handleChange}
                size={2}
                errorMessage={errors.category} 
            />

           <div className="mb-3" style={{ display: 'flex', alignItems: 'center', direction: 'rtl' }}>
            <input 
                type="checkbox" 
                name="kosher" 
                checked={formData.kosher || false} 
                onChange={(e) => handleChange({ 
                    target: { 
                        name: 'kosher', 
                        value: e.target.checked 
                    } 
                })} 
                style={{ width: '18px', height: '18px', marginLeft: '10px' }}
            />
            <label style={{ margin: 0, fontWeight: 'bold' }}>מסעדה כשרה?</label>
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
                text="צור מסעדה"
                colorId='1'
                onClickHandler={handleSubmit}
            />
            </div>
        </div>
    );
}

export default AddRestaurantPage;