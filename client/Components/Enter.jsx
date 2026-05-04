import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button, TextField, Box, Typography, Paper, Avatar } from '@mui/material'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import swal from 'sweetalert'
import { setCurrent } from '../Redux/userSlice'
import { requestCurrent } from '../Redux/requestSlice'
import API from '../api';
import { resetCurrentRequest } from '../Redux/requestSlice'

export const Enter = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const list = useSelector(state => state.user.list)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCurrent(null));
        dispatch(resetCurrentRequest());
        localStorage.clear();
    }, [dispatch]);

    const send = async () => {
        if (user.username && user.password) {
            try {
                const response = await API.post('/auth/login', {
                    username: user.username,
                    password: user.password
                });

                dispatch(setCurrent(response.data.user));
                swal(`Welcome back!`, response.data.message, 'success');
                navigate('/home');
            } catch (error) {
                swal('Oops!', error.response?.data?.message || 'Login failed', 'error');
            }
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
                maxWidth: 400,
                width: '100%',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#e8f5e9'
            }}>
                <Avatar sx={{ m: 1, bgcolor: '#388E3C', width: 56, height: 56 }}>
                    <LockOpenIcon fontSize="large" />
                </Avatar>

                <Typography component="h1" variant="h5" fontWeight="bold" color="#388E3C" sx={{ mb: 3 }}>
                    Sign In
                </Typography>

                <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
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
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        onBlur={(e) => setUser({ ...user, password: e.target.value })}
                        sx={inputStyle}
                    />

                    <Button
                        variant="contained"
                        onClick={send}
                        fullWidth
                        size="large"
                        sx={{
                            mt: 4,
                            mb: 2,
                            backgroundColor: '#388E3C',
                            height: 50,
                            fontSize: '1.1rem',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#2e7d32' }
                        }}
                        endIcon={<LockOpenIcon />}
                    >
                        Sign In
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link to="/login" style={{ color: '#388E3C', textDecoration: 'none', fontWeight: 'bold' }}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}