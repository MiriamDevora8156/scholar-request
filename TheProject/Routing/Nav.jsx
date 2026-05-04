import { useSelector, useDispatch } from "react-redux"
import { NavLink, useLocation } from "react-router-dom"
import { Button, Typography, Box, AppBar, Toolbar, Avatar, Container } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home'
import LoginIcon from '@mui/icons-material/Login'
import InfoIcon from '@mui/icons-material/Info'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { logout as logoutAction } from '../Redux/userSlice'
import API from '../api'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { setFilters, setFilterLocked } from '../Redux/requestSlice'

export const Nav = () => {
    const user = useSelector(state => state.user.current)
    const location = useLocation();

    // צבעים
    const brandColor = '#388E3C';
    const bgColor = '#101010';
    const textColor = '#ffffff';

    // סגנון דינמי לכפתורים
    const navButtonStyle = (path) => {
        const isActive = location.pathname.includes(path);
        return {
            color: isActive ? brandColor : textColor,
            fontWeight: isActive ? 'bold' : '500',
            fontSize: '0.95rem',
            textTransform: 'none',
            marginX: 0.5,
            paddingX: 2,
            borderRadius: 2,
            backgroundColor: isActive ? 'rgba(56, 142, 60, 0.15)' : 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: brandColor,
            },
            transition: 'all 0.3s ease'
        };
    };

    const dispatch = useDispatch()

    const handleLogout = async () => {
        await API.post('/auth/logout');
        dispatch(logoutAction());
        dispatch(setFilterLocked(false));
        dispatch(setFilters({
            id: '', city: '', minSiblings: '', minSalary: '',
            fromDate: '', toDate: '', sortBy: 'submissionDate', order: 'desc'
        }));
    }

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: bgColor,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                borderBottom: '1px solid #333'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', height: 70 }}>

                    {/* צד שמאל: לוגו ותפריט */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>

                        {/* לוגו האתר */}
                        <Box
                            component={NavLink}
                            to="home"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                gap: 1
                            }}
                        >
                            <SchoolIcon sx={{ color: brandColor, fontSize: 32 }} />
                            <Typography variant="h5" sx={{
                                color: '#fff',
                                fontWeight: 800,
                                letterSpacing: '-0.5px',
                                display: { xs: 'none', sm: 'block' }
                            }}>
                                ScholarRequest
                            </Typography>
                        </Box>

                        {/* תפריט ניווט - כל הכפתורים המקוריים */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button component={NavLink} to="home" sx={navButtonStyle('home')} startIcon={<HomeIcon />}>
                                Home Page
                            </Button>

                            <Button component={NavLink} to="enter" sx={navButtonStyle('enter')} startIcon={<LoginIcon />}>
                                Login
                            </Button>

                            {user?.role != 'admin' && (
                                <Button component={NavLink} to="requestForm" sx={navButtonStyle('requestForm')} startIcon={<AssignmentIcon />}>
                                    Request Form
                                </Button>)}

                            {user?.role != 'admin' && (
                                <Button component={NavLink} to="status" sx={navButtonStyle('status')} startIcon={<InfoIcon />}>
                                    Request Status
                                </Button>)}

                            {user?.role == 'admin' && (
                                <Button component={NavLink} to="viewRequest" sx={navButtonStyle('viewRequest')} startIcon={<VisibilityIcon />}>
                                    View Requests
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* צד ימין: פרטי משתמש */}
                    {user?.name ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Button
                                onClick={handleLogout}
                                startIcon={<ExitToAppIcon sx={{ fontSize: '1rem' }} />}
                                sx={{
                                    color: '#aaa',
                                    textTransform: 'none',
                                    fontSize: '0.8rem',
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.5,
                                    minHeight: 'unset',
                                    border: '1px solid #333',
                                    '&:hover': {
                                        backgroundColor: 'rgba(239,83,80,0.08)',
                                        borderColor: '#50ef5d',
                                        color: '#50ef5d'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Logout
                            </Button>
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.75rem' }}>
                                    Welcome,
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', lineHeight: 1 }}>
                                    {user.name}
                                </Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: brandColor, width: 40, height: 40, border: '2px solid #333' }}>
                                <PersonIcon sx={{ color: '#fff' }} />
                            </Avatar>
                        </Box>
                    ) : (
                        <Box></Box>
                    )}

                </Toolbar>
            </Container>
        </AppBar>
    )
}