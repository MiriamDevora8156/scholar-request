import { useNavigate } from "react-router"
import { Box, Typography, Button, Container, Paper } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home'
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export const Apply = () => {

    const navigate = useNavigate()

    return (
        <Container maxWidth="sm" sx={{ marginTop: 8 }}>
            <Paper elevation={3} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
                borderRadius: 3,
                backgroundColor: "#f9f9f9",
                textAlign: 'center',
                borderTop: '6px solid #388E3C'
            }}>
                <Box sx={{
                    backgroundColor: '#e8f5e9',
                    borderRadius: '50%',
                    padding: 3,
                    marginBottom: 3
                }}>
                    <TaskAltIcon sx={{ fontSize: 60, color: '#388E3C' }} />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="#388E3C" gutterBottom>
                    Application Received!
                </Typography>

                <Typography variant="h6" fontWeight="normal" color="text.primary" gutterBottom>
                    Your request has been successfully saved.
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, marginBottom: 4 }}>
                    Thank you for applying. Our team will review your details as soon as possible. You can check the status of your request in the "Request Status" page.
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate('/home')}
                    size="large"
                    sx={{
                        paddingX: 4,
                        height: '50px',
                        borderRadius: 2,
                        backgroundColor: '#388E3C',
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#2c6b2f',
                        },
                    }}
                    startIcon={<HomeIcon />}
                >
                    Back to Home Page
                </Button>
            </Paper>
        </Container>
    )
}