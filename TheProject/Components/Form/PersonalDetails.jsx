import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Typography, TextField, Button, Stack, Container, Paper } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSave } from "./useSave"
import { personal as per } from "../../Redux/requestSlice"
import { nameValid, numberValid, fileValid } from "./Validation"
import PersonIcon from '@mui/icons-material/Person'; // אייקון לכותרת

const AddressAutocomplete = ({ defaultValue, onSelect, error, inputStyle }) => {
    const [query, setQuery] = useState(defaultValue || '');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const debounceRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        clearTimeout(debounceRef.current);
        if (val.length < 3) { setSuggestions([]); setOpen(false); return; }
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=il&format=json&limit=5`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                setSuggestions(data);
                setOpen(true);
            } catch { setSuggestions([]); }
        }, 400);
    };

    const handleSelect = (place) => {
        const display = place.display_name;
        setQuery(display);
        setSuggestions([]);
        setOpen(false);
        onSelect(display);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
                label="Address"
                value={query}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                placeholder="Start typing your address..."
                error={!!error}
                helperText={error}
                sx={inputStyle}
            />
            {open && suggestions.length > 0 && (
                <Box sx={{
                    position: 'absolute', zIndex: 1000, width: '100%',
                    backgroundColor: '#fff', border: '1px solid #ccc',
                    borderRadius: 1, boxShadow: 3, maxHeight: 220, overflowY: 'auto'
                }}>
                    {suggestions.map((s, i) => (
                        <Box key={i} onClick={() => handleSelect(s)}
                            sx={{
                                p: 1.5, cursor: 'pointer', fontSize: '0.85rem',
                                borderBottom: '1px solid #f0f0f0',
                                '&:hover': { backgroundColor: '#e8f5e9' }
                            }}>
                            {s.display_name}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export const PersonalDetails = (props) => {

    const temp = useSelector(state => state.request.current.personal)
    const user = useSelector(state => state.user.current)
    const dispatch = useDispatch();

    const [details, setDetails] = useState(
        (temp && Object.keys(temp).length > 0)
            ? temp
            : { id: user?.id || '', name: user?.name || '', lastName: '', birthDate: '', address: '', phone: '' }
    ); const [errors, setErrors] = useState({})

    const idCardError = errors.idCardFileObj || props.fileErrors?.idCardFileObj;

    const save = useSave(per, details, props.func)

    useEffect(() => {
        if (temp && Object.keys(temp).length > 0) {
            setDetails(temp);
        }
    }, [temp]);

    useEffect(() => {
        if (props.onSaveNowRef) {
            props.onSaveNowRef.current = () => {
                dispatch(per(details)); return details;
            };
            return () => { props.onSaveNowRef.current = null; };
        }
    }, [details]);

    const checkLastName = (value) => {
        if (nameValid(value) === '') setDetails({ ...details, lastName: value })
        setErrors({ ...errors, lastName: nameValid(value) })
    }

    const checkBirthDate = (value) => {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age >= 18 && age <= 120) {
            setDetails({ ...details, birthDate: value })
            setErrors({ ...errors, birthDate: '' })
        } else {
            setErrors({ ...errors, birthDate: 'Age not suitable' })
        }
    }

    const checkAddress = (value) => {
        const regex = /^[a-zA-Zא-ת\s]{2,} \d+$/;
        if (!value)
            return setErrors({ ...errors, address: 'Value is required' })
        if (regex.test(value)) {
            setDetails({ ...details, address: value })
            setErrors({ ...errors, address: '' })
        } else {
            setErrors({ ...errors, address: 'Invalid address' })
        }
    }

    const checkPhone = (value) => {
        if (numberValid(value, 9, 10, 0, 999999999) === '')
            setDetails({ ...details, phone: value })
        setErrors({ ...errors, phone: numberValid(value, 9, 10, 0, 999999999) })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);

            setDetails({
                ...details,
                idCardFileObj: file,
                idCardFileName: file.name,
                idCardPreview: localUrl
            });
            setErrors({ ...errors, idCardFileObj: '' });
        }
    };

    const handleNext = () => {
        const fileErr = fileValid(details.idCardFile || details.idCardFileObj);
        if (fileErr) {
            setErrors(prev => ({ ...prev, idCardFile: fileErr }));
            return;
        }
        save();
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
                <PersonIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Personal Information
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ width: '100%' }}>
                {/* שורה 1: תעודת זהות ושם פרטי (לקריאה בלבד) */}
                <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                    <TextField
                        label="ID Number"
                        value={(user && user.id) || ''}
                        variant="outlined"
                        fullWidth
                        disabled

                        sx={{
                            "& .MuiInputBase-root.Mui-disabled": {
                                backgroundColor: "#f5f5f5"
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                    <TextField
                        label="First Name"
                        value={(user && user.name) || ''}
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{
                            "& .MuiInputBase-root.Mui-disabled": {
                                backgroundColor: "#f5f5f5"
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                    <TextField
                        label="Last Name"
                        value={details.lastName || ''}
                        autoComplete="off"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                        onBlur={(e) => checkLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                    <TextField
                        label="Birth Date"
                        defaultValue={(temp && temp.birthDate) || ''}
                        autoComplete="off"
                        type="date"
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkBirthDate(e.target.value)}
                        onChange={(e) => setDetails({ ...details, birthDate: e.target.value })}

                        error={!!errors.birthDate}
                        helperText={errors.birthDate}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <AddressAutocomplete
                        defaultValue={temp?.address || ''}
                        onSelect={(addr) => {
                            setDetails({ ...details, address: addr });
                            setErrors({ ...errors, address: '' });
                        }}
                        error={errors.address}
                        inputStyle={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                    <TextField
                        label="Phone Number"
                        defaultValue={(temp && temp.phone) || ''}
                        autoComplete="off"
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkPhone(e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={inputStyle}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
                    <TextField
                        label="Zip Code"
                        defaultValue={temp?.zipCode || ''}
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => setDetails({ ...details, zipCode: e.target.value })}
                        sx={inputStyle}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => window.open('https://doar.israelpost.co.il/locatezip', '_blank')}
                        sx={{ color: '#388E3C', textTransform: 'none', fontSize: '0.85rem' }}
                    >
                        🔍 Find your Zip Code (Israel Post)
                    </Button>
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Attach ID Card (Photo/PDF) *
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<UploadFileIcon />}
                            sx={{
                                borderStyle: 'dashed',
                                py: 2,
                                borderColor: (props.fileErrors?.idCardFile) ? 'red'
                                    : (details.idCardFileUploaded ? '#388E3C'
                                        : (details.idCardFile && details.idCardFile !== 'null' ? '#000' : '#ccc')),
                                color: (props.fileErrors?.idCardFile) ? 'red'
                                    : (details.idCardFileUploaded ? '#388E3C' : 'inherit'),
                                textTransform: 'none',
                                justifyContent: 'flex-start'
                            }}
                        >
                            {details.idCardFileName || (details.idCardFile && details.idCardFile !== 'null' ? 'File already uploaded' : 'Upload ID Card')}
                            <input
                                type="file"
                                hidden
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        props.onFileUpload('idCardFile', file);
                                        setDetails({ ...details, idCardFileName: file.name, idCardFileUploaded: true });
                                    }
                                }}
                            />
                        </Button>
                        {(details.idCardFileUploaded || (details.idCardFile && details.idCardFile !== 'null')) && (
                            <Button size="small" variant="text"
                                sx={{ color: details.idCardFileUploaded ? '#388E3C' : '#666', fontSize: '0.75rem', minWidth: 'auto' }}
                                onClick={() => {
                                    if (details.idCardFileUploaded) {
                                        const file = props.filesRef?.current?.idCardFile;
                                        if (file) window.open(URL.createObjectURL(file), '_blank');
                                    } else {
                                        window.open(`http://localhost:3002/${details.idCardFile.replace(/\\/g, '/')}`, '_blank');
                                    }
                                }}
                            >
                                {details.idCardFileUploaded ? '● Preview New File' : '○ View Saved File'}
                            </Button>
                        )}
                    </Stack>
                    {props.fileErrors?.idCardFile && (
                        <Typography variant="caption" sx={{ color: 'red', mt: 0.5, display: 'block' }}>
                            {props.fileErrors.idCardFile}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}