import React from 'react';

// A reusable button component
// It receives text, styling, and a click handler via props
function InputBox({ text, inputValue, onInputChange, size, errorMessage, name }) {

    const sizeMap = {
        1: 'input-group-sm', 
        2: '',                // Default size doesn't need an extra class
        3: 'input-group-lg'  
    };

    const sizeWrapperClass = sizeMap[size] || '';

    return (
        <div className="mb-3">
            <div className={`input-group mb-3 ${sizeWrapperClass}`}>
                
                {/* The grey box containing the label text */}
                <div className="input-group-prepend">
                    <span className="input-group-text">{text}</span>
                </div>
                
                {/* The actual input field */}
                <input
                    name={name}
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={onInputChange}
                />
            </div>
            {errorMessage && (
                <div className="alert alert-danger mt-1 text-center" role="alert">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default InputBox;