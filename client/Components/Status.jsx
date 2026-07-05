import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { Box, Typography, Button, Paper, Stack } from "@mui/material"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import {
    Send as SendIcon,
    Login as LoginIcon,
    AddCircleOutlineOutlined as AddCircleOutlineIcon,
    HourglassEmpty as HourglassEmptyIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { waiting } from "../Redux/requestSlice"
import API from '../api'

export const Status = () => {
    const userCurrent = useSelector(state => state.user.current)
    const requests = useSelector(state => state.request.list)
    const [requestCurrent, setRequestCurrent] = useState()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const isAuthChecked = useSelector(state => state.user.isAuthChecked);

    const fetchStatus = async () => {

        // מפעילים את השליפה רק אם האימות הסתיים ויש משתמש מחובר
        if (isAuthChecked && userCurrent?._id) {
            try {
                const response = await API.get('/requests/my-status');
                setRequestCurrent(response.data);
            } catch (err) {
                console.error("שגיאה בשליפת הסטטוס:", err);
            } finally {
                setLoading(false);
            }
        } else if (isAuthChecked && !userCurrent?._id) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [isAuthChecked, userCurrent?._id]);

    const appeal = async () => {
        if (requestCurrent) {
            try {
                await API.put(`/requests/appeal/${requestCurrent._id}`);
                navigate('/home')
            } catch (err) {
                console.error("Appeal failed");
            }
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'waiting': return <HourglassEmptyIcon sx={{ fontSize: 80, color: '#ff9800', marginBottom: 2 }} />;
            case 'allow': return <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', marginBottom: 2 }} />;
            case 'reject': return <CancelIcon sx={{ fontSize: 80, color: '#f44336', marginBottom: 2 }} />;
            default: return null;
        }
    }

    if (loading && isAuthChecked) {
        return <Typography sx={{ textAlign: 'center', mt: 5 }}>Loading your status...</Typography>;
    }
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, padding: 2 }}>
            <Paper elevation={3} sx={{
                maxWidth: 600,
                width: '100%',
                padding: 5,
                borderRadius: 3,
                backgroundColor: "#f9f9f9",
                textAlign: 'center'
            }}>
                <Typography variant="h4" fontWeight="bold" color="#388E3C" gutterBottom>
                    Application Status
                </Typography>

                {
                    userCurrent?._id && requestCurrent
                        ? (
                            <Box sx={{ marginTop: 4 }}>
                                {getStatusIcon(requestCurrent.status)}

                                <Typography variant="h5" fontWeight="500" gutterBottom>
                                    {requestCurrent.status === 'waiting' && "Under Review"}
                                    {requestCurrent.status === 'allow' && "Approved"}
                                    {requestCurrent.status === 'reject' && "Rejected"}
                                </Typography>

                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    {requestCurrent.status === 'waiting' && "Your request is currently being processed by our team."}
                                    {requestCurrent.status === 'allow' && "Congratulations! Your request has been approved."}
                                    {requestCurrent.status === 'reject' && "We are sorry, but your request has been rejected at this time."}
                                </Typography>

                                {requestCurrent.status === 'reject' && (
                                    <Button
                                        variant="contained"
                                        onClick={appeal}
                                        color="success"
                                        size="large"
                                        sx={{ mt: 2, px: 4, borderRadius: 2 }}
                                        endIcon={<SendIcon />}
                                    >
                                        Submit Appeal
                                    </Button>
                                )}
                            </Box>
                        )
                        : !userCurrent?._id
                            ? (
                                <Box sx={{ marginTop: 4 }}>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                        Please log in to view your application status.
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/enter')}
                                        color="success"
                                        size="large"
                                        startIcon={<LoginIcon />}
                                        sx={{ mt: 1, px: 4, borderRadius: 2 }}
                                    >
                                        Login to Account
                                    </Button>
                                </Box>
                            )
                            : (
                                <Box sx={{ marginTop: 4 }}>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                        You haven't submitted a request yet.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/requestForm')}
                                        color="success"
                                        size="large"
                                        startIcon={<AddCircleOutlineIcon />}
                                        sx={{ mt: 1, px: 4, borderRadius: 2 }}
                                    >
                                        Start New Request
                                    </Button>
                                </Box>
                            )
                }
            </Paper>
        </Box>
    )
}