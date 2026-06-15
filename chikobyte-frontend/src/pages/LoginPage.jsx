import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router-dom';


function LoginPage({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        
        if (usernameError) {
            setUsernameError('');
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handleSubmit = async () => {

        try {
            const response = await fetch('http://localhost:5000/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            // handle validation errors from the server (status 400)
            if (!response.ok) {
                if (data.error) {
                    setPasswordError(data.error);
                } else {
                    console.error("General error:", data.message);
                }
                return; // stop execution if there are errors
            }

            console.log("Login successful!");
                    
            localStorage.setItem('token', data.token);
            
            const userWithOnlyVitalDetails = {
                id: data.user.id,
                realname: data.user.realname,
                address: data.user.address,
                isadmin: data.user.isadmin
            };
            setUser(userWithOnlyVitalDetails); // set the user state to the logged in user
            localStorage.setItem('user', JSON.stringify(userWithOnlyVitalDetails));

            navigate('/');

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="container mt-2" style={{ maxWidth: '400px' }}>
            <div className="mx-auto" style={{ width: '60%' }}>
            <h2 className="brand-name-big">Chikobyte</h2>
            </div>
            <h2 className="mb-4 text-center">התחבר ל-chikobyte כדי להתחיל לחגוג!</h2>
            
            <InputBox 
                text="שם משתמש:"
                inputValue={username}
                onInputChange={handleUsernameChange}
                size={2}
                errorMessage={usernameError} 
            />
            <InputBox 
                text="סיסמה:"
                inputValue={password}
                onInputChange={handlePasswordChange}
                size={2}
                errorMessage={passwordError} 
            />
            <div className="mx-auto" style={{ width: '30%' }}>
            <CustomButton
                text="התחבר"
                colorId='1'
                onClickHandler={handleSubmit}
            />
            </div>
        </div>
    );
}

export default LoginPage;