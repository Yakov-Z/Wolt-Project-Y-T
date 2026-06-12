import React from 'react';

// A reusable button component
// It receives text, styling, and a click handler via props
function CustomButton({ text, colorId, onClickHandler }) {

    const colorMap = {
        1: 'btn-primary',   // Blue
        2: 'btn-success',   // Green
        3: 'btn-danger',    // Red
        4: 'btn-warning'    // Yellow
    };

    const colorClass = colorMap[colorId] || 'btn-secondary';

    return (
        <button className={`btn ${colorClass} m-2`} onClick={onClickHandler}>
            {text}
        </button>
    );
}

export default CustomButton;