import React, { useState, useEffect } from 'react';
import CustomButton from '../components/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProductPage({ user }) {
   
    const { id, productId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: ''
    });
    
    const [imageText, setImageText] = useState('');
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                
                const response = await fetch(`http://localhost:5000/api/restaurants/${id}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    
                    if (data.owner && data.owner.id !== user.id) {
                        alert("אין לך הרשאה לערוך מנות במסעדה זו.");
                        navigate(`/restaurant/${id}`); 
                        return;
                    }
                    
                    
                    const productToUpdate = data.menu.find(p => p.id === productId);
                    
                    if (productToUpdate) {
                        setFormData({
                            name: productToUpdate.name || productToUpdate.productName || '',
                            description: productToUpdate.description || '',
                            category: productToUpdate.category || '',
                            price: productToUpdate.price || ''
                        });
                        setImageText(productToUpdate.image || '');
                    } else {
                        setError("המנה לא נמצאה בתפריט.");
                    }
                } else {
                    setError("שגיאה בטעינת נתוני המסעדה.");
                }
            } catch (err) {
                console.error("Error fetching product details", err);
                setError("שגיאת תקשורת מול השרת.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id, productId, user.id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
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
            setError('לא נמצא אימות. אנא התחבר מחדש.');
            return;
        }

        try {
            
            const response = await fetch(`http://localhost:5000/api/restaurants/${id}/products/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(`שגיאה בעדכון: ${data.error || data.message}`);
                }
                return;
            }

            navigate(`/restaurant/${id}`);

        } catch (error) {
            console.error('Error during update:', error);
            alert("אירעה שגיאה בעת ניסיון העדכון.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>טוען נתונים...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', fontSize: '1.2rem' }}>{error}</div>;

    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' };
    const inputStyle = {
        width: '100%', padding: '12px 15px', boxSizing: 'border-box', borderRadius: '8px', 
        border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', 
        transition: 'border-color 0.2s', backgroundColor: '#fff'
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', direction: 'rtl' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2 style={{ color: '#2c3e50', fontSize: '2.2rem', margin: '0' }}>עדכון מנה</h2>
                    <p style={{ color: '#7f8c8d', marginTop: '10px' }}>ערוך את פרטי המנה בתפריט</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                        
                        <div>
                            <label style={labelStyle}>שם המנה</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                            {errors.name && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.name}</span>}
                        </div>

                        <div>
                            <label style={labelStyle}>תיאור המנה</label>
                            <textarea 
                                name="description" value={formData.description} onChange={handleChange} 
                                rows="3" style={{ ...inputStyle, resize: 'vertical' }} 
                            />
                            {errors.description && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.description}</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>מחיר (₪)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} style={inputStyle} min="0" step="0.1" />
                                {errors.price && <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.price}</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>קטגוריה</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} style={inputStyle} />
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
                        <CustomButton onClickHandler={handleSubmit} colorId="1" text="שמור שינויים במנה" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateProductPage;