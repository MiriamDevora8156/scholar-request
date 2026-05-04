import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Stack, Divider, Container, Paper, CircularProgress, Snackbar, Alert } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import SchoolIcon from '@mui/icons-material/School';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useDispatch, useSelector } from "react-redux";
import { saveDraftToDB, requestCurrent } from "../../Redux/requestSlice";
import SaveIcon from '@mui/icons-material/Save';
import API from '../../api'

export const MultiForm = (props) => {
    let steps = React.Children.toArray(props.children);
    const [num, setNum] = useState(0);
    const [error, setError] = useState('');
    const [details, setDetails] = useState({});
    const [form, setForm] = useState({ 0: '', 1: '', 2: '', 3: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [fileErrors, setFileErrors] = useState({});
    const [draftSaved, setDraftSaved] = useState(false);

    const dispatch = useDispatch();

    const cur = useSelector(s => s.request.current);

    const filesRef = useRef({
        idCardFile: null,
        tuitionFile: null,
        bankConfirmationFile: null,
        fatherSlip: null,
        motherSlip: null,
    });

    const stepRequiredFields = {
        0: ['lastName', 'birthDate', 'address', 'phone'],
        1: ['fatherFirstName', 'fatherLastName', 'fatherId', 'motherFirstName', 'motherLastName', 'motherId', 'numChildren'],
        2: ['trend', 'payment', 'years'],
        3: ['accountName', 'accountId', 'bank', 'branch', 'number']
    };

    const fileFieldPairs = {
        0: [['idCardFile', 'idCardFile']],
        1: [['fatherSlip', 'fatherSlip'], ['motherSlip', 'motherSlip']],
        2: [['tuitionFile', 'tuitionFile']],
        3: [['bankConfirmationFile', 'bankConfirmationFile']]
    };

    const stepParts = { 0: 'personal', 1: 'family', 2: 'course', 3: 'bank' };
    const stepToReduxKey = { 0: 'personal', 1: 'family', 2: 'course', 3: 'bank' };

    const curRef = useRef(cur);
    useEffect(() => { curRef.current = cur; }, [cur]);

    useEffect(() => {
        async function fetchDraft() {
            try {
                setDetails({});
                const response = await API.get('/requests/my-draft');
                if (response.data) {
                    dispatch(requestCurrent(response.data));
                    setDetails(response.data);
                } else {
                    setDetails({});
                    dispatch(requestCurrent(null));
                }
            } catch (err) {
                console.error("טעינת טיוטה נכשלה:", err);
            }
        }
        fetchDraft();

        const handleUnload = () => {
            if (!curRef.current || Object.keys(curRef.current).length === 0) return;
            const url = 'http://localhost:3002/api/requests/draft-text';
            const blob = new Blob([JSON.stringify(curRef.current)], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            await dispatch(saveDraftToDB()).unwrap();
            setSnackbar({ open: true, message: 'הטיוטה נשמרה בהצלחה!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err || 'שגיאה בשמירת הטיוטה', severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const buildFormData = (data, files, isFinal = false) => {
        const formData = new FormData();

        const uiOnlyFields = [
            'bankConfirmationFileName', 'bankConfirmationFileUploaded',
            'idCardFileName', 'idCardFileUploaded', 'idCardPreview',
            'tuitionFileName', 'tuitionFileUploaded',
            'fatherSlipName', 'fatherSlipUploaded',
            'motherSlipName', 'motherSlipUploaded'
        ];

        const cleanData = (obj) => {
            const cleaned = {};
            Object.entries(obj || {}).forEach(([k, v]) => {
                if (v !== null && v !== 'null' && v !== undefined && !uiOnlyFields.includes(k)) {
                    cleaned[k] = v;
                }
            });
            return cleaned;
        };

        const personalData = cleanData(data.personal);
        const familyData = { ...cleanData(data.family), siblings: data.family?.siblings || [] };
        const courseData = cleanData(data.course);
        const bankData = cleanData(data.bank);

        if (isFinal) {
            delete personalData.idCardFile;
            delete courseData.tuitionFile;
            delete bankData.bankConfirmationFile;
            delete familyData.fatherSlip;
            delete familyData.motherSlip;
        }

        if (files.idCardFile) formData.append('idCardFile', files.idCardFile);
        if (files.tuitionFile) formData.append('tuitionFile', files.tuitionFile);
        if (files.bankConfirmationFile) formData.append('bankConfirmationFile', files.bankConfirmationFile);
        if (files.fatherSlip) formData.append('fatherSlip', files.fatherSlip);
        if (files.motherSlip) formData.append('motherSlip', files.motherSlip);

        formData.append('personal', JSON.stringify(personalData));
        formData.append('family', JSON.stringify(familyData));
        formData.append('course', JSON.stringify(courseData));
        formData.append('bank', JSON.stringify(bankData));

        return formData;
    };

    const onFileUpload = (fieldName, file) => {
        filesRef.current[fieldName] = file;
        setFileErrors(prev => {
            const updated = { ...prev };
            delete updated[fieldName];
            return updated;
        });
    };

    const getMissingFileErrors = () => {
        const sectionData = cur[stepParts[num]] || {};
        const pairs = fileFieldPairs[num] || [];
        const errors = {};
        pairs.forEach(([fileKey, dbField]) => {
            if (!filesRef.current[fileKey] && !sectionData[dbField]) {
                errors[fileKey] = 'File is required';
            }
        });
        return errors;
    };

    const currentChild = () => {
        let funcToSend = num < 4
            ? setDetails
            : { form, setError, filesRef, buildFormData };
        return React.cloneElement(steps[num], {
            func: funcToSend,
            fileErrors,
            onFileUpload,
            filesRef,
            onSaveNowRef,
            key: num
        });
    };

    const saveDraft = async () => {
        try {
            if (typeof onSaveNowRef.current === 'function') {
                onSaveNowRef.current();
            }

            await new Promise(resolve => setTimeout(resolve, 0));

            const formData = buildFormData(cur, filesRef.current);
            await API.post('/requests/draft', formData);
            setDraftSaved(true);
            setTimeout(() => setDraftSaved(false), 3000);
        } catch (err) {
            console.error("שמירת טיוטה נכשלה:", err);
        }
    };

    const onSaveNowRef = useRef(null);


    const isFill = (sectionData) => {
        const fieldsToVerify = stepRequiredFields[num];
        if (!fieldsToVerify) return true;
        const source = sectionData || cur[stepToReduxKey[num]] || {};
        return fieldsToVerify.every(field => {
            const value = source[field];
            return value !== undefined && value !== null && value.toString().trim() !== '';
        });
    };

    const next = () => {
        const currentData = onSaveNowRef.current ? onSaveNowRef.current() : null;
        if (isFill(currentData)) {
            setForm({ ...form, [num]: 'ok' });
            setNum(num + 1);
            setError('');
            setFileErrors({});
        } else {
            setError('All forms must be filled out');
            setFileErrors(getMissingFileErrors());
        }
    };

    const prev = () => {
        const currentData = onSaveNowRef.current ? onSaveNowRef.current() : null;
        if (isFill(currentData)) {
            setForm({ ...form, [num]: 'ok' });
            setError('');
            setFileErrors({});
        }
        if (num > 0) setNum(num - 1);
    };

    const step = (i) => {
        const currentData = onSaveNowRef.current ? onSaveNowRef.current() : null;
        if (isFill(currentData)) {
            setForm({ ...form, [num]: 'ok' });
            setFileErrors({});
        }
        setNum(i);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{
                p: 5,
                borderRadius: 3,
                backgroundColor: '#e8f5e9',
                borderTop: '6px solid #388E3C',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, paddingBottom: 2, borderBottom: '1px solid #eee' }}>
                    <SchoolIcon sx={{ fontSize: 40, color: '#388E3C', mr: 2 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#2c3e50">
                            Scholarship Application
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Page {num + 1} of {steps.length} • Please fill in details accurately
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ width: '100%', position: 'relative', mb: 4, mt: 1 }}>
                    <Divider sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 40, right: 40, borderWidth: 1, borderColor: '#e0e0e0', zIndex: 0 }} />
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            position: 'relative',
                            zIndex: 1,
                            px: 2
                        }}
                    >
                        {steps.map((x, i) => {
                            const isCompleted = form[i] === 'ok';
                            const isActive = i === num;
                            return (
                                <Button key={i} onClick={() => step(i)} sx={{
                                    borderRadius: "50%", minWidth: 0,
                                    width: isActive ? 60 : 50, height: isActive ? 60 : 50,
                                    fontSize: isActive ? "1.2rem" : "1rem", fontWeight: "bold",
                                    backgroundColor: isActive || isCompleted ? "#388E3C" : "#fff",
                                    color: isActive || isCompleted ? "#fff" : "#757575",
                                    border: isActive || isCompleted ? "none" : "2px solid #e0e0e0",
                                    boxShadow: isActive ? "0 4px 10px rgba(56, 142, 60, 0.4)" : "none",
                                    transition: "all 0.3s ease",
                                    "&:hover": { backgroundColor: isActive ? "#2e7d32" : "#f5f5f5", transform: "scale(1.1)" }
                                }}>
                                    {i + 1}
                                </Button>
                            );
                        })}
                    </Stack>
                </Box>

                <Box sx={{ flexGrow: 1, py: 2 }}>
                    {error && (
                        <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 3, borderColor: '#d32f2f', backgroundColor: '#ffebee', color: '#c62828' }}>
                            <ErrorIcon sx={{ mr: 1 }} />
                            <Typography variant="body1" fontWeight="500">{error}</Typography>
                        </Paper>
                    )}
                    {currentChild()}
                </Box>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        mt: 4,
                        pt: 3,
                        borderTop: "1px solid #f0f0f0"
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={prev}
                        disabled={num === 0}
                        size="large"
                        startIcon={<NavigateBeforeIcon />}
                        sx={{ borderRadius: 2, px: 4, textTransform: 'none', borderColor: '#bdbdbd', color: '#616161' }}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={saveDraft}
                        disabled={num === steps.length - 1}
                        size="large"
                        sx={{
                            borderRadius: 2, px: 3, textTransform: 'none',
                            borderColor: draftSaved ? '#388E3C' : '#bdbdbd',
                            color: draftSaved ? '#388E3C' : '#616161',
                        }}
                    >
                        {draftSaved ? '✓ Draft Saved' : 'Save Draft'}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={next}
                        disabled={num === steps.length - 1}
                        size="large"
                        endIcon={<NavigateNextIcon />}
                        sx={{
                            borderRadius: 2, px: 4, textTransform: 'none',
                            backgroundColor: '#388E3C',
                            boxShadow: '0 4px 12px rgba(56, 142, 60, 0.3)',
                            '&:hover': { backgroundColor: '#2e7d32' }
                        }}
                    >
                        Next Step
                    </Button>
                </Stack>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}