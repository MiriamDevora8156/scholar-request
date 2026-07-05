import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Typography, TextField, Button, Stack, Container, Paper } from "@mui/material";
import { useSave } from "./useSave"
import { family } from "../../Redux/requestSlice"
import { nameValid, numberValid, idValid } from "./Validation"
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'; // אייקון משפחה
import UploadFileIcon from '@mui/icons-material/UploadFile'


export const FamilyDetails = (props) => {

    const temp = useSelector(state => state.request.current.family)
    const [details, setDetails] = useState(
        (temp && Object.keys(temp).length > 0) ? temp : {
            fatherFirstName: '', fatherLastName: '', fatherId: '',
            motherFirstName: '', motherLastName: '', motherId: '',
            numChildren: '', numOver: '', siblings: [],
            fatherSlipName: '', motherSlipName: '',
            fatherSlipUploaded: false, motherSlipUploaded: false
        }
    );

    const [errors, setErrors] = useState({})
    const save = useSave(family, details, props.func)
    const dispatch = useDispatch();

    useEffect(() => {
        if (temp && Object.keys(temp).length > 0) {
            setDetails(temp);
        }
    }, [temp]);

    useEffect(() => {
        if (props.onSaveNowRef) {
            props.onSaveNowRef.current = () => {
                dispatch(family(details)); return details; // ← הוסף שורה זו
            };
            return () => { props.onSaveNowRef.current = null; };
        }
    }, [details]);

    const checkNumChildren = (value) => {
        const count = parseInt(value) || 0;
        let newSiblings = [...(details.siblings || [])];

        if (numberValid(value, 0, 999, -1, 100) === '') {
            if (count > newSiblings.length) {
                for (let i = newSiblings.length; i < count; i++) {
                    newSiblings.push({ id: '', firstName: '', lastName: '', birthDate: '' });
                }
            } else {
                newSiblings = newSiblings.slice(0, count);
            }
            setDetails({ ...details, numChildren: value, siblings: newSiblings })
        }
        setErrors({ ...errors, numChildren: numberValid(value, 1, 3, -1, 100) })
    }

    const updateSibling = (index, field, value) => {
        const updatedSiblings = [...details.siblings];
        updatedSiblings[index] = { ...updatedSiblings[index], [field]: value };
        setDetails({ ...details, siblings: updatedSiblings });
    };

    const checkNumOver = (value) => {
        if (details.numChildren < value)
            return setErrors({ ...errors, numOver: 'Incorrect value entered' })
        if (numberValid(value, 0, 999, -1, 100) === '')
            setDetails({ ...details, numOver: value })
        setErrors({ ...errors, numOver: numberValid(value, 1, 3, 0, 100) })
    }

    const handleSlipChange = (e, member) => {
        const file = e.target.files[0];
        if (file) {
            props.onFileUpload(`${member}Slip`, file);
            setDetails({ ...details, [`${member}SlipName`]: file.name, [`${member}SlipUploaded`]: true });
        }
    }
    const validateFiles = () => {
        const errs = {
            fatherSlip: fileValid(details.fatherSlipObj),
            motherSlip: fileValid(details.motherSlipObj),
            studentSlip: fileValid(details.studentSlipObj)
        };
        setErrors(prev => ({ ...prev, ...errs }));
        return !errs.fatherSlipObj && !errs.motherSlipObj && !errs.studentSlipObj;
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
                <FamilyRestroomIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Family Information
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid xs={12} sm={4} sx={{ width: '100%' }}>
                    <TextField
                        label="Father's First Name"
                        defaultValue={temp?.fatherFirstName}
                        variant="outlined" fullWidth sx={inputStyle}
                        onBlur={(e) => {
                            const err = nameValid(e.target.value);
                            setErrors({ ...errors, fatherFirstName: err });
                            if (!err) setDetails({ ...details, fatherFirstName: e.target.value });
                        }}
                        error={!!errors.fatherFirstName}
                        helperText={errors.fatherFirstName}
                    />
                </Grid>
                <Grid xs={12} sm={4} sx={{ width: '100%' }}>
                    <TextField
                        label="Father's Last Name"
                        defaultValue={temp?.fatherLastName}
                        variant="outlined" fullWidth sx={inputStyle}
                        onBlur={(e) => {
                            const err = nameValid(e.target.value);
                            setErrors({ ...errors, fatherLastName: err });
                            if (!err) setDetails({ ...details, fatherLastName: e.target.value });
                        }}
                        error={!!errors.fatherLastName}
                        helperText={errors.fatherLastName}
                    />
                </Grid>
                <Grid xs={12} sm={4} sx={{ width: '100%' }}>
                    <TextField
                        label="Father's ID"
                        defaultValue={temp?.fatherId}
                        variant="outlined" fullWidth sx={inputStyle}
                        onBlur={(e) => {
                            const err = idValid(e.target.value);
                            setErrors({ ...errors, fatherId: err });
                            if (!err) setDetails({ ...details, fatherId: e.target.value });
                        }}
                        error={!!errors.fatherId}
                        helperText={errors.fatherId}
                    />
                </Grid>

                <Grid xs={12} sm={4} sx={{ width: '100%' }}>
                    <TextField
                        label="Mother's First Name"
                        defaultValue={temp?.motherFirstName}
                        variant="outlined" fullWidth sx={inputStyle}
                        onBlur={(e) => {
                            const err = nameValid(e.target.value);
                            setErrors({ ...errors, motherFirstName: err });
                            if (!err) setDetails({ ...details, motherFirstName: e.target.value });
                        }}
                        error={!!errors.motherFirstName}
                        helperText={errors.motherFirstName}
                    />
                </Grid>
                <Grid xs={12} sm={4} sx={{ width: '100%' }}>
                    <TextField
                        label="Mother's Last Name"
                        defaultValue={temp?.motherLastName}
                        variant="outlined" fullWidth sx={inputStyle}
                        onBlur={(e) => {
                            const err = nameValid(e.target.value);
                            setErrors({ ...errors, motherLastName: err });
                            if (!err) setDetails({ ...details, motherLastName: e.target.value });
                        }}
                        error={!!errors.motherLastName}
                        helperText={errors.motherLastName}
                    />
                </Grid>
                <Grid xs={12} sm={4} sx={{ width: '100%' }}>
                    <TextField
                        label="Mother's ID"
                        defaultValue={temp?.motherId}
                        variant="outlined" fullWidth sx={inputStyle}
                        onBlur={(e) => {
                            const err = idValid(e.target.value);
                            setErrors({ ...errors, motherId: err });
                            if (!err) setDetails({ ...details, motherId: e.target.value });
                        }}
                        error={!!errors.motherId}
                        helperText={errors.motherId}
                    />
                </Grid>

                <Grid xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Number of Children"
                        defaultValue={temp && temp.numChildren}
                        variant="outlined"
                        type="number"
                        fullWidth
                        onChange={(e) => checkNumChildren(e.target.value)}
                        error={!!errors.numChildren}
                        helperText={errors.numChildren}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Children Over 18"
                        defaultValue={temp && temp.numOver}
                        variant="outlined"
                        type="number"
                        fullWidth
                        onBlur={(e) => checkNumOver(e.target.value)}
                        error={!!errors.numOver}
                        helperText={errors.numOver}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 1, fontWeight: 'bold' }}>
                        Parents Income Slips (Required) *
                    </Typography>
                    <Grid container spacing={2}>
                        {['father', 'mother'].map((member) => {
                            const fileError = props.fileErrors?.[`${member}Slip`];
                            const isUploaded = details[`${member}SlipUploaded`];
                            const hasSaved = temp?.[`${member}Slip`] && temp[`${member}Slip`] !== 'null'
                                ? temp[`${member}Slip`]
                                : null;
                            return (
                                <Grid xs={12} md={6} key={member}>
                                    <Stack spacing={1}>
                                        <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}
                                            sx={{
                                                borderStyle: 'dashed', height: '70px',
                                                borderColor: fileError ? 'red' : (isUploaded ? '#388E3C' : (hasSaved ? '#000' : '#ccc')),
                                                color: fileError ? 'red' : (isUploaded ? '#388E3C' : 'inherit'),
                                                textTransform: 'none', justifyContent: 'flex-start', px: 2
                                            }}
                                        >
                                            <Stack alignItems="flex-start">
                                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                    {member.toUpperCase()} INCOME SLIP *
                                                </Typography>
                                                <Typography variant="body2">
                                                    {details[`${member}SlipName`] || (hasSaved ? 'File already uploaded' : 'Click to upload')}
                                                </Typography>
                                            </Stack>
                                            <input type="file" hidden accept="image/*,.pdf"
                                                onChange={(e) => handleSlipChange(e, member)} />
                                        </Button>

                                        {(hasSaved || isUploaded) && (
                                            <Button size="small" variant="text"
                                                sx={{ color: isUploaded ? '#388E3C' : '#666', fontSize: '0.75rem', alignSelf: 'flex-start' }}
                                                onClick={() => {
                                                    if (isUploaded) {
                                                        const file = props.filesRef?.current?.[`${member}Slip`];
                                                        if (file) window.open(URL.createObjectURL(file), '_blank');
                                                    } else {
                                                        window.open(`http://localhost:3002/${hasSaved.replace(/\\/g, '/')}`, '_blank');
                                                    }
                                                }}
                                            >
                                                {isUploaded ? '● Preview New File' : '○ View Saved File'}
                                            </Button>
                                        )}

                                        {fileError && (
                                            <Typography variant="caption" color="error" sx={{ px: 1 }}>
                                                {fileError}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
                {/* חלק דינמי - פרטי אחים (שומר על ה-inputStyle שלך) */}
                {details.siblings && details.siblings.map((sibling, index) => (
                    <Grid xs={12} key={index}>
                        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f9f9f9', borderStyle: 'dashed' }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#388E3C' }}>Sibling #{index + 1} Details</Typography>
                            <Grid container spacing={2}>
                                <Grid xs={12} sm={3}>
                                    <TextField label="ID" size="small" fullWidth onBlur={(e) => updateSibling(index, 'id', e.target.value)} defaultValue={sibling.id} sx={inputStyle} />
                                </Grid>
                                <Grid xs={12} sm={3}>
                                    <TextField label="First Name" size="small" fullWidth onBlur={(e) => updateSibling(index, 'firstName', e.target.value)} defaultValue={sibling.firstName} sx={inputStyle} />
                                </Grid>
                                <Grid xs={12} sm={3}>
                                    <TextField label="Last Name" size="small" fullWidth onBlur={(e) => updateSibling(index, 'lastName', e.target.value)} defaultValue={sibling.lastName} sx={inputStyle} />
                                </Grid>
                                <Grid xs={12} sm={3}>
                                    <TextField label="Birth Date" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} onBlur={(e) => updateSibling(index, 'birthDate', e.target.value)} defaultValue={sibling.birthDate} sx={inputStyle} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}