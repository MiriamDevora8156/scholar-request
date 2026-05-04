import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Grid, Divider, Paper, Stack, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FaxIcon from '@mui/icons-material/Fax';
import LanguageIcon from '@mui/icons-material/Language';
import API from '../api'

// --- תמונה ---
import classroomImage from '../Picturs/copy-project.jpg';
import { useDispatch, useSelector } from "react-redux";

// --- רכיב עזר לאנימציית מספרים ---
const AnimatedCounter = ({ target }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const duration = 2000;
                    const increment = Math.ceil(target / (duration / 16));

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(start);
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [target]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

export const Home = () => {

    const navigate = useNavigate();


    // נתונים לסטטיסטיקה
    const stats = [
        { id: 1, label: "Scholarships Granted", value: 1250, icon: <EmojiEventsIcon fontSize="large" /> },
        { id: 2, label: "Satisfied Students", value: 98, suffix: "%", icon: <GroupIcon fontSize="large" /> },
        { id: 3, label: "Partner Institutions", value: 45, icon: <SchoolIcon fontSize="large" /> },
        { id: 4, label: "Funds Distributed ($M)", value: 12, icon: <AccountBalanceIcon fontSize="large" /> },
    ];

    // נתונים לשירותים
    const services = [
        { icon: <SupportAgentIcon fontSize="large" />, title: "Personal Support", text: "24/6 guidance through every step of the application process." },
        { icon: <SchoolIcon fontSize="large" />, title: "Scholarship Variety", text: "Support for various trends: Engineering, Arts, Science, and more." },
        { icon: <SpeedIcon fontSize="large" />, title: "Fast Approval", text: "Get your request approved within days, not months." },
        { icon: <SecurityIcon fontSize="large" />, title: "Secure Data", text: "Your personal and bank details are encrypted and safe." },
    ];

    // נתונים להמלצות
    const testimonials = [
        { id: 1, name: "David C.", text: "The service was incredible. I received my scholarship within weeks! Highly recommended for everyone.", trend: "Computer Science" },
        { id: 2, name: "Sarah L.", text: "Easy process and very helpful support team. They guided me through every document needed.", trend: "Architecture" },
        { id: 3, name: "Moshe K.", text: "Thanks to this site, I can focus on my studies without worry. The best platform available.", trend: "Engineering" },
        { id: 4, name: "Rachel B.", text: "I didn't believe I could get funding, but they made it happen. Truly a life changer.", trend: "Medicine" },
        { id: 5, name: "Yossi A.", text: "Clear instructions and fast money transfer. Amazing service.", trend: "Law" },
        { id: 6, name: "Noa G.", text: "The best platform for students in Israel. Thank you for making it so simple!", trend: "Design" },
    ];

    return (
        <Box sx={{ width: "100%", overflowX: "hidden", backgroundColor: "#fff" }}>

            {/* 1. Hero Section */}
            <Box sx={{
                width: "100%",
                height: "80vh",
                backgroundImage: `url(${classroomImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                textAlign: "center",
                position: "relative",
                '&::before': {
                    content: '""',
                    position: "absolute",
                    top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                }
            }}>
                <Box sx={{ position: "relative", zIndex: 1, padding: 2 }}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
                        ScholarRequest
                    </Typography>
                    <Typography variant="h5" sx={{ maxWidth: 800, margin: "auto", marginBottom: 4, fontWeight: 300 }}>
                        Building your future, together. <br />
                        Get the financial support you deserve with our easy application process.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/enter')}
                        sx={{
                            backgroundColor: "#388E3C",
                            padding: "12px 40px",
                            fontSize: "1.2rem",
                            borderRadius: "30px",
                            "&:hover": { backgroundColor: "#2E7D32" }
                        }}
                    >
                        Apply Now
                    </Button>
                </Box>
            </Box>

            {/* 2. About Us */}
            <Box sx={{ padding: 8, backgroundColor: "#f5f5f5", textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" color="#388E3C" fontWeight="bold" gutterBottom>
                        About Us
                    </Typography>
                    <Divider sx={{ width: 100, margin: "auto", marginBottom: 3, backgroundColor: "#388E3C", height: 3 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        Founded in 2010, ScholarRequest began with a simple mission: to make education accessible to everyone.
                        We understand the financial burden on students and strive to bridge the gap.
                        Over the past decade, we have helped thousands of students achieve their academic dreams.
                    </Typography>
                </Container>
            </Box>

            {/* 3. Our Services - כולם בשורה אחת! */}
            <Box sx={{ padding: 8, backgroundColor: "#e8f5e9" }}>
                <Container maxWidth="xl"> {/* שימוש ברוחב רחב יותר כדי למנוע צפיפות */}
                    <Typography variant="h3" align="center" color="#388E3C" fontWeight="bold" gutterBottom>
                        Our Services
                    </Typography>

                    <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
                        {services.map((service, index) => (
                            // md={3} אומר: תפוס 3 יחידות מתוך 12. כלומר 4 אלמנטים בשורה (3*4=12)
                            <Grid item xs={12} md={2} key={index} sx={{ display: 'flex' }}>
                                <Paper elevation={3} sx={{
                                    padding: 4,
                                    textAlign: 'center',
                                    width: '150px',
                                    height: '80%', // מבטיח גובה אחיד
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    transition: 'transform 0.3s',
                                    "&:hover": { transform: 'translateY(-10px)' },
                                    borderRadius: 4
                                }}>
                                    <Box sx={{ color: '#388E3C', marginBottom: 2 }}>{service.icon}</Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>{service.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{service.text}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 4. Impact / Statistics */}
            <Box sx={{ padding: 8, backgroundColor: "#fff" }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" color="#388E3C" fontWeight="bold" gutterBottom>
                        Our Impact
                    </Typography>
                    <Grid container spacing={4} sx={{ marginTop: 2, justifyContent: "center" }}>
                        {stats.map((stat) => (
                            <Grid item xs={12} sm={6} md={3} key={stat.id}>
                                <Stack sx={{ alignItems: "center" }} spacing={1}>
                                    <Box sx={{ color: '#388E3C' }}>{stat.icon}</Box>
                                    <Typography variant="h3" fontWeight="bold" color="text.primary">
                                        <AnimatedCounter target={stat.value} />{stat.suffix || "+"}
                                        {/* <Stack>{stat.value}{stat.suffix || "+"}</Stack> */}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" align="center">
                                        {stat.label}
                                    </Typography>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 5. Testimonials - 3 בשורה אחת עם רווחים ברורים! */}
            <Box sx={{ padding: 8, backgroundColor: "#f9f9f9" }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" align="center" color="#388E3C" fontWeight="bold" gutterBottom>
                        Student Testimonials
                    </Typography>
                    <Grid container spacing={3} sx={{ marginTop: 1 }}>
                        {testimonials.map((t) => (
                            <Grid item xs={12} md={4} key={t.id}>
                                <Paper sx={{
                                    padding: 3,
                                    backgroundColor: '#fff',
                                    borderTop: '4px solid #388E3C',
                                    height: '90%',
                                    width: '260px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="body1" fontStyle="italic" sx={{ marginBottom: 2 }}>
                                        "{t.text}"
                                    </Typography>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {t.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {t.trend} Student
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 6. Footer */}
            <Box sx={{ backgroundColor: "#1b5e20", color: "white", padding: 6, marginTop: 0 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>ScholarRequest</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Empowering students to reach their full potential through financial aid and support.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Contact Us</Typography>
                            <Stack spacing={2}>
                                <Box display="flex" sx={{ alignItems: "center" }} gap={2}>
                                    <PhoneIcon /> <Typography>+972-3-1234567</Typography>
                                </Box>
                                <Box display="flex" sx={{ alignItems: "center" }} gap={2}>
                                    <EmailIcon /> <Typography>support@scholarrequest.com</Typography>
                                </Box>
                                <Box display="flex" sx={{ alignItems: "center" }} gap={2}>
                                    <FaxIcon /> <Typography>+972-3-7654321</Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Visit Us</Typography>
                            <Stack spacing={2}>
                                <Box display="flex" sx={{ alignItems: "center" }} gap={2}>
                                    <LanguageIcon /> <Typography>www.scholarrequest.com</Typography>
                                </Box>
                                <Typography variant="body2" sx={{ opacity: 0.8, marginTop: 2 }}>
                                    123 Education St., Tech Park, <br />
                                    Tel Aviv, Israel
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", marginY: 4 }} />
                    <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
                        © 2025 ScholarRequest. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};