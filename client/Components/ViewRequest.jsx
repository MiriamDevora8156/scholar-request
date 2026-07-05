import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Box, Typography, Button, Divider, Paper, TextField, MenuItem, Grid, Stack } from "@mui/material";
import { setAllRequests, selectPendingRequests, setFilters, setFilterLocked } from "../Redux/requestSlice";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import API from "../api";

export const ViewRequest = () => {
    const list = useSelector(selectPendingRequests);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const filters = useSelector(state => state.request.filters);
    const isFilterLocked = useSelector(state => state.request.isFilterLocked);

    // פונקציה לשליפת הנתונים מהשרת עם הפילטרים
    const fetchRequests = async () => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await API.get(`/requests/pending?${params.toString()}`);
            dispatch(setAllRequests(response.data));
        } catch (err) {
            console.error("Error fetching filtered requests:", err);
        }
    };

    const user = useSelector(state => state.user.current);
    const isAuthChecked = useSelector(state => state.user.isAuthChecked);

    useEffect(() => {
        if (!isFilterLocked && isAuthChecked && user?._id) {
            fetchRequests();
        }
    }, [filters, isFilterLocked, isAuthChecked, user?._id]);

    const cellStyle = { textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const headerStyle = { ...cellStyle, color: '#2e7d32', fontWeight: 'bold', fontSize: '0.9rem' };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
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
        <Box sx={{ p: 4, backgroundColor: '#f4fbf4', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
                Grant Management Portal
            </Typography>

            {/* שורת סינון וחיפוש מעוצבת */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#ffffff' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <FilterListIcon color="success" />
                    <Typography variant="h6" color="#2e7d32" fontWeight="bold">Filters</Typography>
                </Stack>

                <Grid container spacing={2}>
                    {/* שורה ראשונה - פרטים אישיים */}
                    <Grid xs={12} sm={3}>
                        <TextField fullWidth label="ID Number" size="small" value={filters.id}
                            onChange={(e) => dispatch(setFilters({ ...filters, id: e.target.value }))} sx={inputStyle} />
                    </Grid>
                    <Grid xs={12} sm={3}>
                        <TextField fullWidth label="City" size="small" value={filters.city}
                            onChange={(e) => dispatch(setFilters({ ...filters, city: e.target.value }))} sx={inputStyle} />
                    </Grid>
                    <Grid xs={12} sm={2}>
                        <TextField
                            fullWidth label="Min Tuition Fee" size="small" type="number"
                            value={filters.minSalary}
                            onChange={(e) => dispatch(setFilters({ ...filters, minSalary: e.target.value }))} sx={inputStyle}
                        />
                    </Grid>
                    <Grid xs={12} sm={3}>
                        <TextField fullWidth label="Min Children" size="small" type="number" value={filters.minSiblings}
                            onChange={(e) => dispatch(setFilters({ ...filters, minSiblings: e.target.value }))} sx={inputStyle} />
                    </Grid>

                    {/* שורה שנייה - תאריכים ומיון */}
                    <Grid xs={12} sm={3}>
                        <TextField fullWidth label="From Date" type="date" size="small" slotProps={{ inputLabel: { shrink: true } }}
                            value={filters.fromDate} onChange={(e) => dispatch(setFilters({ ...filters, fromDate: e.target.value }))} />
                    </Grid>
                    <Grid xs={12} sm={3}>
                        <TextField fullWidth label="To Date" type="date" size="small" slotProps={{ inputLabel: { shrink: true } }}
                            value={filters.toDate} onChange={(e) => dispatch(setFilters({ ...filters, toDate: e.target.value }))}
                        />
                    </Grid>
                    <Grid xs={12} sm={3}>
                        <TextField select fullWidth label="Sort By" size="small" value={filters.sortBy}
                            onChange={(e) => dispatch(setFilters({ ...filters, sortBy: e.target.value }))} sx={inputStyle}>
                            <MenuItem value="submissionDate">Date</MenuItem>
                            <MenuItem value="tuition">Tuition Fee Amount</MenuItem>
                            <MenuItem value="family.numChildren">Number of Children</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid xs={12} sm={3}>
                        <Button
                            fullWidth
                            variant={isFilterLocked ? "contained" : "outlined"}
                            onClick={() => {
                                if (isFilterLocked) {
                                    dispatch(setFilters({
                                        id: '', city: '', minSiblings: '', minSalary: '',
                                        fromDate: '', toDate: '', sortBy: 'submissionDate', order: 'desc'
                                    }));
                                    dispatch(setFilterLocked(false));
                                } else {
                                    dispatch(setFilterLocked(true));
                                    fetchRequests();
                                }
                            }}
                            sx={{
                                backgroundColor: isFilterLocked ? '#388E3C' : 'transparent',
                                color: isFilterLocked ? '#fff' : '#388E3C',
                                borderColor: '#388E3C',
                                height: '40px',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: isFilterLocked ? '#c62828' : 'rgba(56,142,60,0.08)',
                                    borderColor: isFilterLocked ? '#c62828' : '#388E3C',
                                }
                            }}
                        >
                            {isFilterLocked ? '✕ Clear Filters' : 'Apply Filters'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* טבלת הנתונים */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', backgroundColor: '#e8f5e9' }}>
                <Box sx={{ padding: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="h5" color="#1b5e20" fontWeight="bold">Pending Requests</Typography>
                    <Typography variant="body2" color="text.secondary">Review and manage scholarship eligibility</Typography>
                </Box>

                <Box sx={{ padding: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr 1fr', gap: 2, alignItems: 'center' }}>
                        <Typography sx={headerStyle}>ID</Typography>
                        <Typography sx={headerStyle}>First Name</Typography>
                        <Typography sx={headerStyle}>Last Name</Typography>
                        <Typography sx={headerStyle}>Trend</Typography>
                        <Typography sx={headerStyle}>Status</Typography>
                        <Typography sx={headerStyle}>Actions</Typography>

                        <Divider sx={{ gridColumn: 'span 6', my: 1, backgroundColor: '#a5d6a7' }} />

                        {list.map((request) => (
                            <React.Fragment key={request._id}>
                                <Typography sx={cellStyle}>{request.personal.id}</Typography>
                                <Typography sx={cellStyle}>{request.personal.name}</Typography>
                                <Typography sx={cellStyle}>{request.personal.lastName}</Typography>
                                <Typography sx={cellStyle}>{request.course.trend}</Typography>
                                <Box sx={cellStyle}>
                                    <Box sx={{
                                        p: '4px 12px', borderRadius: '20px', backgroundColor: '#fff',
                                        color: '#2e7d32', fontWeight: 'bold', border: '1px solid #a5d6a7', textAlign: 'center'
                                    }}>
                                        {request.status}
                                    </Box>
                                </Box>
                                <Box sx={cellStyle}>
                                    <Button
                                        variant="contained" size="small" color="success"
                                        onClick={() => navigate(`/requestDetails/${request._id}`)}
                                        sx={{ borderRadius: 5, textTransform: 'none' }}
                                    >
                                        Details
                                    </Button>
                                </Box>
                                <Divider sx={{ gridColumn: 'span 6', opacity: 0.2 }} />
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}