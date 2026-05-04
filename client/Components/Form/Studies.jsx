import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, TextField, Grid, Button, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSave } from "./useSave"
import { course } from "../../Redux/requestSlice"
import { nameValid, numberValid } from "./Validation"
import MenuBookIcon from '@mui/icons-material/MenuBook';

export const Studies = (props) => {

    const temp = useSelector(state => state.request.current.course)
    const [details, setDetails] = useState(
        (temp && Object.keys(temp).length > 0) ? temp :
            { trend: '', payment: '', years: '', institution: '', tuitionFile: null, tuitionFileName: '' }
    );
    const [errors, setErrors] = useState({})
    const save = useSave(course, details, props.func)
    const dispatch = useDispatch();

    const tuitionError = errors.tuitionFileObj || props.fileErrors?.tuitionFileObj;

    useEffect(() => {
        if (temp && Object.keys(temp).length > 0) {
            setDetails(temp);
        }
    }, [temp]);

    useEffect(() => {
        if (props.onSaveNowRef) {
            props.onSaveNowRef.current = () => {
                dispatch(course(details)); return details; // ← הוסף שורה זו
            };
            return () => { props.onSaveNowRef.current = null; };
        }
    }, [details]);

    const checkInstitution = (value) => {
        if (nameValid(value) === '') setDetails({ ...details, institution: value });
        setErrors({ ...errors, institution: nameValid(value) });
    };

    const checkTrend = (value) => {
        if (nameValid(value) === '')
            setDetails({ ...details, trend: value })
        setErrors({ ...errors, trend: nameValid(value) })
    }

    const checkPayment = (value) => {
        if (numberValid(value, 0, 999, 0, 100000) === '')
            setDetails({ ...details, payment: value })
        setErrors({ ...errors, payment: numberValid(value, 0, 999, 0, 100000) })
    }

    const checkYears = (value) => {
        const errorMsg = numberValid(value, 1, 2, 1, 15); // הגדרת טווח הגיוני לשנות לימוד
        if (errorMsg === '') setDetails({ ...details, years: value });
        setErrors({ ...errors, years: errorMsg });
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDetails({ ...details, tuitionFileObj: file, tuitionFileName: file.name });
            setErrors({ ...errors, tuitionFileObj: '' }); // ניקוי שגיאה
        }
    };

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
        <Box sx={{ width: '100%' }}>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3, color: '#388E3C' }}>
                <MenuBookIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Course Details
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Institution Name"
                        defaultValue={temp?.institution}
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkInstitution(e.target.value)}
                        error={!!errors.institution}
                        helperText={errors.institution}
                        sx={inputStyle}
                    />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <FormControl fullWidth variant="outlined" sx={inputStyle}>
                        <InputLabel>Trend / Major</InputLabel>
                        <Select
                            defaultValue={temp?.trend || ''}
                            label="Trend / Major"
                            onChange={(e) => {
                                setDetails({ ...details, trend: e.target.value });
                                setErrors({ ...errors, trend: '' });
                            }}
                        >
                            <MenuItem value="Computer Science">Computer Science</MenuItem>
                            <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                            <MenuItem value="Information Systems">Information Systems</MenuItem>
                            <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
                            <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                            <MenuItem value="Business Administration">Business Administration</MenuItem>
                            <MenuItem value="Economics">Economics</MenuItem>
                            <MenuItem value="Medicine">Medicine</MenuItem>
                            <MenuItem value="Law">Law</MenuItem>
                            <MenuItem value="Psychology">Psychology</MenuItem>
                            <MenuItem value="Education">Education</MenuItem>
                            <MenuItem value="Architecture">Architecture</MenuItem>
                        </Select>
                        {errors.trend && (
                            <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                {errors.trend}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Annual Tuition Fee"
                        defaultValue={temp && temp.payment}
                        variant="outlined"
                        type="number"
                        fullWidth
                        onBlur={(e) => checkPayment(e.target.value)}
                        error={!!errors.payment}
                        helperText={errors.payment}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Year of Study (e.g. 1, 2, 3)"
                        defaultValue={temp && temp.years}
                        variant="outlined"
                        type="number"
                        fullWidth
                        onBlur={(e) => checkYears(e.target.value)}
                        error={!!errors.years}
                        helperText={errors.years}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Tuition Confirmation (PDF/Image) *
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}
                            sx={{
                                borderStyle: 'dashed', py: 2,
                                borderColor: props.fileErrors?.tuitionFile ? 'red'
                                    : (details.tuitionFileUploaded ? '#388E3C'
                                        : (details.tuitionFile && details.tuitionFile !== 'null' ? '#000' : '#ccc')),
                                color: props.fileErrors?.tuitionFile ? 'red'
                                    : (details.tuitionFileUploaded ? '#388E3C' : 'inherit'),
                                textTransform: 'none', justifyContent: 'flex-start'
                            }}
                        >
                            {details.tuitionFileName ||
                                (details.tuitionFile && details.tuitionFile !== 'null'
                                    ? 'File already uploaded'
                                    : 'Upload Tuition Confirmation')}
                            <input type="file" hidden accept="image/*,.pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        props.onFileUpload('tuitionFile', file);
                                        setDetails({ ...details, tuitionFileName: file.name, tuitionFileUploaded: true });
                                    }
                                }}
                            />
                        </Button>
                        {(details.tuitionFileUploaded || (details.tuitionFile && details.tuitionFile !== 'null')) && (
                            <Button size="small" variant="text"
                                sx={{ color: details.tuitionFileUploaded ? '#388E3C' : '#666', fontSize: '0.75rem', minWidth: 'auto' }}
                                onClick={() => {
                                    if (details.tuitionFileUploaded) {
                                        const file = props.filesRef?.current?.tuitionFile;
                                        if (file) window.open(URL.createObjectURL(file), '_blank');
                                    } else {
                                        window.open(`http://localhost:3002/${details.tuitionFile.replace(/\\/g, '/')}`, '_blank');
                                    }
                                }}
                            >
                                {details.tuitionFileUploaded ? '● Preview New File' : '○ View Saved File'}
                            </Button>
                        )}
                    </Stack>
                    {props.fileErrors?.tuitionFile && (
                        <Typography variant="caption" sx={{ color: 'red', mt: 0.5, display: 'block' }}>
                            {props.fileErrors.tuitionFile}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}