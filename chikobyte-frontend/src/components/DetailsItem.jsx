import React from 'react';

export default function UserDetailItem({ label, value }) {
    if (!value) return null;

    return (
        <div style={styles.container}>            
            <div style={styles.textContainer}>
                <span style={styles.label}>{label}:</span>
                <span style={styles.value}>{value}</span>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        margin: '8px 0',
        backgroundColor: 'rgba(0, 0, 0, 0.03)', 
        borderRadius: '8px',
        border: '1px solid #eaeaea',
    },
    icon: {
        fontSize: '1.2rem',
        marginRight: '12px', 
        marginLeft: '12px', 
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '0.85rem',
        color: '#666', 
        fontWeight: '500',
    },
    value: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#333', 
        marginTop: '2px',
    }
};