import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

function AddProductPage({ user }) {
    
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: ''
    });
    const [imageText, setImageText] = useState('');
    const [errors, setErrors] = useState({});

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageText(reader.result);
            reader.readAsDataURL(file);
            if (errors.image) setErrors(prev => ({ ...prev, image: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price), 
            image: imageText
        };
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert("שגיאה: אינך מחובר למערכת.");
            return;
        }

        try {
           
            const response = await fetch(`http://localhost:5000/api/restaurants/${id}/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // טיפול בשגיאות ולידציה מהשרת
            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data.error || "אירעה שגיאה בהוספת המנה");
                }
                return;
            }

            // הצלחה! חוזרים אוטומטית לעמוד המסעדה
            navigate(`/restaurant/${id}`);

        } catch (error) {
            console.error('Error adding product:', error);
            alert('שגיאת תקשורת עם השרת.');
        }
    };

   
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' };
    const inputStyle = { width: '100%', padding: '12px 15px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontFamily: 'inherit' };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', direction: 'rtl' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2 style={{ color: '#2c3e50', fontSize: '2.2rem', margin: '0' }}>הוספת מנה לתפריט</h2>
                    <p style={{ color: '#7f8c8d', marginTop: '10px' }}>הכנס את פרטי המנה החדשה שתופיע ללקוחות</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                        
                        
                        <div>
                            <label style={labelStyle}>שם המנה</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="למשל: המבורגר הבית" />
                            {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.name}</span>}
                        </div>
                        
                        
                        <div>
                            <label style={labelStyle}>תיאור המנה</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} rows="3" placeholder="מה המרכיבים המרכזיים במנה..." />
                            {errors.description && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.description}</span>}
                        </div>

                       
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>מחיר (₪)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="0.00" min="0" step="0.1" />
                                {errors.price && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.price}</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>קטגוריה</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} style={inputStyle} placeholder="למשל: עיקריות, שתייה" />
                                {errors.category && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.category}</span>}
                            </div>
                        </div>

                        
                        <div>
                            <label style={labelStyle}>תמונת המנה</label>
                            <div style={{ border: '1px dashed #adb5bd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
                            </div>
                            {errors.image && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.image}</span>}
                        </div>
                        
                    </div>
                    
                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                        <CustomButton onClickHandler={handleSubmit} colorId="1" text="הוסף מנה לתפריט" />
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default AddProductPage;