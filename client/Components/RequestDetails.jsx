import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { updateRequestInList } from "../Redux/requestSlice";
import { Button, Box, Typography, Divider, Paper, Grid, CircularProgress, Stack } from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    FamilyRestroom as FamilyRestroomIcon,
    School as SchoolIcon,
    AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import swal from 'sweetalert';
import API from "../api";

export const RequestDetails = () => {
    const { requestId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. שליפת פרטי הבקשה מהשרת לפי ה-ID
    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const response = await API.get(`/requests/get/${requestId}`);
                setRequest(response.data);
            } catch (err) {
                swal("שגיאה", "לא ניתן היה לטעון את פרטי הבקשה", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchRequestDetails();
    }, [requestId]);

    // 2. פונקציה לעדכון סטטוס (אישור/דחייה)
    const handleStatusUpdate = async (newStatus) => {
        try {
            await API.put(`/requests/update/${requestId}`, { status: newStatus });

            dispatch(updateRequestInList({ id: requestId, status: newStatus }));

            swal("הצלחה", `הבקשה סומנה כ${newStatus}`, "success");
            navigate('/viewRequest');
        } catch (err) {
            swal("שגיאה", "עדכון הסטטוס נכשל בשרת", "error");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="success" /></Box>;
    if (!request) return <Typography variant="h6" textAlign="center" mt={10}>הבקשה לא נמצאה</Typography>;

    const InfoRow = ({ label, value }) => (
        <Grid xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body1" fontWeight="500">{value || 'לא צוין'}</Typography>
        </Grid>
    );

    return (
        <Paper elevation={3} sx={{
            padding: 5,
            maxWidth: 900,
            margin: 'auto',
            backgroundColor: '#e8f5e9',
            borderRadius: 3,
            marginTop: 5,
            marginBottom: 5,
            borderTop: '6px solid #388E3C'
        }}>

            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Request Details
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Request ID: #{requestId}
                    </Typography>
                </Box>
            </Box>

            {/* Personal Details */}
            <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, color: '#388E3C' }}>
                    <PersonIcon sx={{ marginRight: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Personal Information</Typography>
                </Box>
                <Grid container spacing={2}>
                    <InfoRow label="ID Number" value={request.personal.id} />
                    <InfoRow label="Date of Birth" value={request.personal.birthDate} />
                    <InfoRow label="First Name" value={request.personal.name} />
                    <InfoRow label="Last Name" value={request.personal.lastName} />
                    <InfoRow label="Address" value={request.personal.address} />
                    <InfoRow label="Phone" value={request.personal.phone} />
                    <InfoRow label="Zip Code" value={request.personal.zipCode} />
                </Grid>
            </Box>

            <Divider sx={{ marginY: 3, opacity: 0.6 }} />

            {/* Family Details */}
            <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, color: '#388E3C' }}>
                    <FamilyRestroomIcon sx={{ marginRight: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Family Information</Typography>
                </Box>
                <Grid container spacing={2}>
                    <InfoRow label="Father's First Name" value={request.family.fatherFirstName} />
                    <InfoRow label="Father's Last Name" value={request.family.fatherLastName} />
                    <InfoRow label="Father's ID" value={request.family.fatherId} />
                    <InfoRow label="Mother's First Name" value={request.family.motherFirstName} />
                    <InfoRow label="Mother's Last Name" value={request.family.motherLastName} />
                    <InfoRow label="Mother's ID" value={request.family.motherId} />
                    <InfoRow label="Number of Children" value={request.family.numChildren} />
                    <InfoRow label="Children Over 18" value={request.family.numOver} />
                    {request.family.siblings?.length > 0 && (
                        <Grid xs={12}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Siblings</Typography>
                            {request.family.siblings.map((s, i) => (
                                <Typography key={i} variant="body2">
                                    {i + 1}. {s.firstName} {s.lastName} — ID: {s.id} — Born: {s.birthDate?.slice(0, 10)}
                                </Typography>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Divider sx={{ marginY: 3, opacity: 0.6 }} />

            {/* Education Details */}
            <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, color: '#388E3C' }}>
                    <SchoolIcon sx={{ marginRight: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Education</Typography>
                </Box>
                <Grid container spacing={2}>
                    <InfoRow label="Institution" value={request.course.institution} />
                    <InfoRow label="Trend / Course" value={request.course.trend} />
                    <InfoRow label="Years of Study" value={request.course.years} />
                    <InfoRow label="Tuition Fee" value={request.course.payment ? `${request.course.payment} ₪` : ''} />
                </Grid>
            </Box>

            <Divider sx={{ marginY: 3, opacity: 0.6 }} />

            {/* Bank Details */}
            <Box sx={{ marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, color: '#388E3C' }}>
                    <AccountBalanceIcon sx={{ marginRight: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bank Details</Typography>
                </Box>
                <Grid container spacing={2}>
                    <InfoRow label="Account Holder" value={request.bank.accountName} />
                    <InfoRow label="Account ID" value={request.bank.accountId} />
                    <InfoRow label="Bank" value={request.bank.bank} />
                    <InfoRow label="Branch" value={request.bank.branch} />
                    <InfoRow label="Account Number" value={request.bank.number} />
                </Grid>
            </Box>

            <Divider sx={{ marginY: 3, opacity: 0.6 }} />

            {/* Documents Section */}
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#388E3C' }}>
                    Attached Documents
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {[
                        { label: 'ID Card', path: request.personal?.idCardFile },
                        { label: 'Tuition Confirmation', path: request.course?.tuitionFile },
                        { label: 'Bank Confirmation', path: request.bank?.bankConfirmationFile },
                        { label: "Father's Income Slip", path: request.family?.fatherSlip },
                        { label: "Mother's Income Slip", path: request.family?.motherSlip },
                    ].map(({ label, path }) => (
                        path && path !== 'null' ? (
                            <Button
                                key={label}
                                variant="outlined"
                                size="small"
                                onClick={() => window.open(`http://localhost:3002/${path.replace(/\\/g, '/')}`, '_blank')}
                                sx={{ borderColor: '#388E3C', color: '#388E3C', textTransform: 'none', borderRadius: 2 }}
                            >
                                📄 {label}
                            </Button>
                        ) : (
                            <Button key={label} variant="outlined" size="small" disabled
                                sx={{ textTransform: 'none', borderRadius: 2 }}>
                                {label}: Not uploaded
                            </Button>
                        )
                    ))}
                </Box>
            </Box>

            {/* Actions Buttons */}
            <Box sx={{ display: 'flex', gap: 2, marginTop: 5, justifyContent: 'flex-end', alignItems: 'center' }}>
                {request.status === 'reject' && (
                    <Typography variant="body2" sx={{ color: '#f44336', fontStyle: 'italic', mr: 2 }}>
                        This request has already been rejected
                    </Typography>
                )}
                {request.status === 'allow' && (
                    <Typography variant="body2" sx={{ color: '#388E3C', fontStyle: 'italic', mr: 2 }}>
                        This request has already been approved
                    </Typography>
                )}
                <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    onClick={() => handleStatusUpdate('reject')}
                    startIcon={<CancelIcon />}
                    disabled={request.status === 'reject'}
                    sx={{ borderRadius: 2, paddingX: 4 }}
                >
                    Reject Request
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => handleStatusUpdate('allow')}
                    startIcon={<CheckCircleIcon />}
                    disabled={request.status === 'allow'}
                    sx={{
                        borderRadius: 2,
                        paddingX: 4,
                        backgroundColor: '#388E3C',
                        boxShadow: '0 4px 10px rgba(56, 142, 60, 0.3)'
                    }}
                >
                    Approve Request
                </Button>
            </Box>
        </Paper>
    )
}