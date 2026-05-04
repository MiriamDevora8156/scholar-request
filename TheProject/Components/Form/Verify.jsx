import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { add, resetCurrentRequest, requestCurrent } from "../../Redux/requestSlice"
import { useNavigate } from "react-router"
import { Box, Typography, Button, Backdrop, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from "@mui/material"
import CancelIcon from '@mui/icons-material/Cancel'
import SendIcon from '@mui/icons-material/Send'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import API from '../../api'

export const Verify = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const { form, setError } = props.func

    const draftFromRedux = useSelector(state => state.request.current)

    const currentRequest = useSelector(state => state.request.current);

    const send = async () => {
        if (form[0] === 'ok' && form[1] === 'ok' && form[2] === 'ok' && form[3] === 'ok') {
            setIsLoading(true);
            try {
                const { filesRef, buildFormData } = props.func;
                const existingFiles = {
                    idFile: currentRequest.personal?.idFile,
                    incomeSlips: currentRequest.family?.incomeSlips,
                    tuitionFile: currentRequest.course?.tuitionFile,
                    bankConfirmation: currentRequest.bank?.bankConfirmation
                };

                const formData = buildFormData({ ...currentRequest, existingFiles }, filesRef.current, true);

                await API.post('/requests/submit', formData);

                dispatch(resetCurrentRequest());
                navigate('/apply');
            } catch (err) {
                console.error("Error submitting request:", err);
                setError(err.response?.data?.message || 'שגיאה בהגשת הבקשה לשרת');
                setIsLoading(false);
            }
        } else {
            setError('יש למלא את כל הטפסים לפני ההגשה');
        }
    };

    return (
        <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>

            <VerifiedUserIcon sx={{ fontSize: 80, color: '#388E3C', marginBottom: 2, opacity: 0.9 }} />

            <Typography variant="h5" fontWeight="bold" gutterBottom color="#2c3e50">
                Declaration of Accuracy
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, margin: 'auto', marginBottom: 4, lineHeight: 1.6 }}>
                By clicking "Confirm & Send", I hereby declare that all the details I have entered in the application forms are correct, complete, and accurate to the best of my knowledge.
            </Typography>

            <Button
                variant="outlined"
                color="success"
                onClick={() => setPreviewOpen(true)}
                disabled={isLoading}
                size="large"
                sx={{ paddingX: 4, height: '50px', borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
            >
                👁 Preview Application
            </Button>


            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 2 }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate('/home')}
                    disabled={isLoading}
                    size="large"
                    startIcon={<CancelIcon />}
                    sx={{
                        paddingX: 4,
                        height: '50px',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={send}
                    disabled={isLoading}
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                        backgroundColor: '#388E3C',
                        paddingX: 4,
                        height: '50px',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(56, 142, 60, 0.4)',
                        '&:hover': {
                            backgroundColor: '#2e7d32',
                            boxShadow: '0 6px 16px rgba(56, 142, 60, 0.6)',
                        },
                    }}
                >
                    {isLoading ? "Sending..." : "Confirm & Send"}
                </Button>
            </Box>

            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ color: '#388E3C', fontWeight: 'bold' }}>
                    Application Preview
                </DialogTitle>
                <DialogContent dividers>
                    {/* Personal */}
                    <Typography variant="subtitle1" fontWeight="bold" color="#388E3C" sx={{ mb: 1 }}>Personal</Typography>
                    <Typography variant="body2">ID: {currentRequest.personal?.id}</Typography>
                    <Typography variant="body2">Name: {currentRequest.personal?.name} {currentRequest.personal?.lastName}</Typography>
                    <Typography variant="body2">Birth Date: {currentRequest.personal?.birthDate}</Typography>
                    <Typography variant="body2">Address: {currentRequest.personal?.address}</Typography>
                    <Typography variant="body2">Zip Code: {currentRequest.personal?.zipCode}</Typography>
                    <Typography variant="body2">Phone: {currentRequest.personal?.phone}</Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Family */}
                    <Typography variant="subtitle1" fontWeight="bold" color="#388E3C" sx={{ mb: 1 }}>Family</Typography>
                    <Typography variant="body2">Father: {currentRequest.family?.fatherFirstName} {currentRequest.family?.fatherLastName} (ID: {currentRequest.family?.fatherId})</Typography>
                    <Typography variant="body2">Mother: {currentRequest.family?.motherFirstName} {currentRequest.family?.motherLastName} (ID: {currentRequest.family?.motherId})</Typography>
                    <Typography variant="body2">Number of Children: {currentRequest.family?.numChildren}</Typography>
                    <Typography variant="body2">Children Over 18: {currentRequest.family?.numOver}</Typography>
                    {currentRequest.family?.siblings?.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Siblings:</Typography>
                            {currentRequest.family.siblings.map((s, i) => (
                                <Typography key={i} variant="body2">
                                    {i + 1}. {s.firstName} {s.lastName} — ID: {s.id}
                                </Typography>
                            ))}
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Course */}
                    <Typography variant="subtitle1" fontWeight="bold" color="#388E3C" sx={{ mb: 1 }}>Education</Typography>
                    <Typography variant="body2">Institution: {currentRequest.course?.institution}</Typography>
                    <Typography variant="body2">Trend: {currentRequest.course?.trend}</Typography>
                    <Typography variant="body2">Years: {currentRequest.course?.years}</Typography>
                    <Typography variant="body2">Tuition: {currentRequest.course?.payment} ₪</Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Bank */}
                    <Typography variant="subtitle1" fontWeight="bold" color="#388E3C" sx={{ mb: 1 }}>Bank</Typography>
                    <Typography variant="body2">Account Holder: {currentRequest.bank?.accountName}</Typography>
                    <Typography variant="body2">Account ID: {currentRequest.bank?.accountId}</Typography>
                    <Typography variant="body2">Bank: {currentRequest.bank?.bank}</Typography>
                    <Typography variant="body2">Branch: {currentRequest.bank?.branch}</Typography>
                    <Typography variant="body2">Account Number: {currentRequest.bank?.number}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)} sx={{ color: '#388E3C' }}>Close</Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
                open={isLoading}
            >
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@keyframes pulse-glow': {
                        '0%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 0 0 rgba(56, 142, 60, 0.7)',
                        },
                        '70%': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 0 0 30px rgba(56, 142, 60, 0)',
                        },
                        '100%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 0 0 rgba(56, 142, 60, 0)',
                        },
                    },
                    animation: 'pulse-glow 2s infinite',
                    borderRadius: '50%',
                    padding: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}>
                    <SendIcon sx={{ fontSize: 100, color: '#4caf50' }} />
                </Box>

                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>
                    Processing Request...
                </Typography>

                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Please wait while we secure your data.
                </Typography>

                <Box sx={{ width: '300px', marginTop: 2 }}>
                    <LinearProgress
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#4caf50'
                            }
                        }}
                    />
                </Box>
            </Backdrop>
        </Box>
    )
}