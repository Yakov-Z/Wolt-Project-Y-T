import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');


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

    const handleSubmit = () => {
        console.log("try to login");
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">"Login Page"</h2>
            
            <InputBox 
                text="Username"
                inputValue={username}
                onInputChange={handleUsernameChange}
                size={2}
                errorMessage={usernameError} 
            />
            <InputBox 
                text="Password"
                inputValue={password}
                onInputChange={handlePasswordChange}
                size={2}
                errorMessage={usernameError} 
            />
            
            <CustomButton
                text="Login"
                colorId='1'
                onClickHandler={handleSubmit}
            />
        </div>
    );
}

export default LoginPage;