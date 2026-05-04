import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, TextField, Button, Paper, Avatar } from '@mui/material'
import { useNavigate } from 'react-router'
import swal from 'sweetalert'
import { add, setCurrent } from '../Redux/userSlice'
import { requestCurrent } from '../Redux/requestSlice'
import { idValid, nameValid } from './Form/Validation'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import API from '../api'

export const Login = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [errors, setErrors] = useState({})
    const list = useSelector(state => state.user.list)
    const dispatch = useDispatch()

    const send = async () => {
        if (errors.name === '' && errors.id === '') {
            if (user.username && user.password) {
                try {
                    const response = await API.post('/auth/register', {
                        username: user.username,
                        password: user.password,
                        id: user.id,
                        name: user.name,
                        email: user.email
                    });

                    swal(`Success!`, 'Account created successfully. Please login.', 'success');

                    navigate('/enter');

                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Registration failed';
                    swal('Oops!', errorMessage, 'error');
                }
            } else {
                swal('Attention', 'Please fill all fields', 'warning');
            }
        } else {
            swal('Wait', 'Please correct the errors in the form', 'warning');
        }
    };

    const checkName = (value) => {
        if (nameValid(value) === '') setUser({ ...user, name: value })
        setErrors({ ...errors, name: nameValid(value) })
    }

    const checkId = (value) => {
        if (idValid(value) === '') setUser({ ...user, id: value })
        setErrors({ ...errors, id: idValid(value) })
    }

    const checkEmail = (value) => {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (valid) {
            setUser({ ...user, email: value });
            setErrors({ ...errors, email: '' });
        } else {
            setErrors({ ...errors, email: 'Invalid email address' });
        }
    };

    const checkPassword = (value) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChars = /[!@#$%^&*]/.test(value);

        if (value.length < minLength) {
            setErrors({ ...errors, password: 'Password must be at least 8 characters long' })
        }
        if (!hasUpperCase) {
            setErrors({ ...errors, password: 'Password must contain at least one uppercase letter' })
        }
        if (!hasLowerCase) {
            setErrors({ ...errors, password: 'Password must contain at least one lowercase letter' })
        }
        if (!hasNumbers) {
            setErrors({ ...errors, password: 'Password must contain at least one number' })
        }
        if (!hasSpecialChars) {
            setErrors({ ...errors, password: 'Password must contain at least one special character' })
        }
        else {
            setUser({ ...user, password: value })
            setErrors({ ...errors, password: '' })
        }

    }

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#388E3C',
            }
        },
        '& .MuiInputLabel-root': {
            '&.Mui-focused': {
                color: '#388E3C',
            }
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
        }}>
            <Paper elevation={4} sx={{
                padding: 4,
                maxWidth: 450,
                width: '100%',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#e8f5e9'
            }}>

                <Avatar sx={{ m: 1, bgcolor: '#388E3C', width: 56, height: 56 }}>
                    <HowToRegIcon fontSize="large" />
                </Avatar>

                <Typography component="h1" variant="h5" fontWeight="bold" color="#388E3C" sx={{ mb: 3 }}>
                    Sign Up
                </Typography>

                <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onBlur={(e) => checkName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={inputStyle}
                    />

                    <TextField
                        label="ID Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onBlur={(e) => checkId(e.target.value)}
                        error={!!errors.id}
                        helperText={errors.id}
                        sx={inputStyle}
                    />

                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onBlur={(e) => setUser({ ...user, username: e.target.value })}
                        sx={inputStyle}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onBlur={(e) => checkPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={inputStyle}
                    />

                    <TextField
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onBlur={(e) => checkEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={inputStyle}
                    />

                    <Button
                        onClick={send}
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 4,
                            mb: 2,
                            backgroundColor: '#388E3C',
                            height: 50,
                            fontSize: '1.1rem',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: '#2e7d32'
                            }
                        }}
                        endIcon={<HowToRegIcon />}
                    >
                        Create Account
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}