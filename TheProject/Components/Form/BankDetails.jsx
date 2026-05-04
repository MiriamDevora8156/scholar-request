import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Button, Stack } from "@mui/material"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSave } from "./useSave"
import { bank } from "../../Redux/requestSlice"
import { nameValid, numberValid } from "./Validation"
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // אייקון בנק

export const BankDetails = (props) => {

    const temp = useSelector(state => state.request.current.bank)
    const [details, setDetails] = useState(
        (temp && Object.keys(temp).length > 0) ? temp :
            { accountName: '', accountId: '', bank: '', branch: '', number: '', bankConfirmationFile: null, bankConfirmationFileName: '' }
    );
    const [errors, setErrors] = useState({})
    const bankFileError = errors.bankConfirmationFileObj || props.fileErrors?.bankConfirmationFileObj;

    const save = useSave(bank, details, props.func)
    const dispatch = useDispatch();

    useEffect(() => {
        if (temp && Object.keys(temp).length > 0) {
            setDetails(temp);
        }
    }, [temp]);

    useEffect(() => {
        if (props.onSaveNowRef) {
            props.onSaveNowRef.current = () => {
                dispatch(bank(details)); return details; // ← הוסף שורה זו
            };
            return () => { props.onSaveNowRef.current = null; };
        }
    }, [details]);

    const checkAccountName = (value) => {
        if (nameValid(value) === '')
            setDetails({ ...details, accountName: value })
        setErrors({ ...errors, accountName: nameValid(value) })
    }

    const checkAccountId = (value) => {
        if (numberValid(value, 9, 9, 0, 999999999) === '')
            setDetails({ ...details, accountId: value })
        setErrors({ ...errors, accountId: numberValid(value, 9, 9, 0, 999999999) })
    }

    const checkBranch = (value) => {
        if (numberValid(value, 1, 6, 0, 100000) === '')
            setDetails({ ...details, branch: value })
        setErrors({ ...errors, branch: numberValid(value, 1, 6, 0, 100000) })
    }

    const checkNumber = (value) => {
        if (numberValid(value, 4, 9, 0, 100000000) === '')
            setDetails({ ...details, number: value })
        setErrors({ ...errors, number: numberValid(value, 4, 9, 0, 100000000) })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDetails({ ...details, bankConfirmationFileObj: file, bankConfirmationFileName: file.name });
            setErrors({ ...errors, bankConfirmationFileObj: '' });
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
                <AccountBalanceIcon sx={{ marginRight: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Bank Information
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Account Holder Name"
                        defaultValue={temp && temp.accountName}
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkAccountName(e.target.value)}
                        error={!!errors.accountName}
                        helperText={errors.accountName}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Account Holder ID"
                        defaultValue={temp && temp.accountId}
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkAccountId(e.target.value)}
                        error={!!errors.accountId}
                        helperText={errors.accountId}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <FormControl fullWidth variant="outlined" error={!!errors.bank} sx={inputStyle}>
                        <InputLabel id="bank-select-label">Bank Name</InputLabel>
                        <Select
                            labelId="bank-select-label"
                            defaultValue={temp && temp.bank ? temp.bank : ''}
                            onChange={(e) => setDetails({ ...details, bank: e.target.value })}
                            label="Bank Name"
                        >
                            <MenuItem value="Pagi 52">Pagi 52</MenuItem>
                            <MenuItem value="Israel 99">Israel 99</MenuItem>
                            <MenuItem value="Poalim 12">Poalim 12</MenuItem>
                            <MenuItem value="Mizrahi Tefahot 20">Mizrahi Tefahot 20</MenuItem>
                            <MenuItem value="Hadoar 09">Hadoar 09</MenuItem>
                            <MenuItem value="Leumi 10">Leumi 10</MenuItem>
                            <MenuItem value="Discount 11">Discount 11</MenuItem>
                            <MenuItem value="Mercantile 17">Mercantile 17</MenuItem>
                        </Select>
                        {errors.bank && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.bank}</Typography>}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Branch Number"
                        defaultValue={temp && temp.branch}
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkBranch(e.target.value)}
                        error={!!errors.branch}
                        helperText={errors.branch}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        label="Account Number"
                        defaultValue={temp && temp.number}
                        variant="outlined"
                        fullWidth
                        onBlur={(e) => checkNumber(e.target.value)}
                        error={!!errors.number}
                        helperText={errors.number}
                        sx={inputStyle}
                    />
                </Grid>

                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Bank Account Confirmation (PDF/Image) *
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}
                            sx={{
                                borderStyle: 'dashed', py: 2,
                                borderColor: props.fileErrors?.bankConfirmationFile ? 'red'
                                    : (details.bankConfirmationFileUploaded ? '#388E3C'
                                        : (details.bankConfirmationFile && details.bankConfirmationFile !== 'null' ? '#000' : '#ccc')),
                                color: props.fileErrors?.bankConfirmationFile ? 'red'
                                    : (details.bankConfirmationFileUploaded ? '#388E3C' : 'inherit'),
                                textTransform: 'none', justifyContent: 'flex-start'
                            }}
                        >
                            {details.bankConfirmationFileName || (details.bankConfirmationFile && details.bankConfirmationFile !== 'null' ? 'File already uploaded' : 'Upload Bank Confirmation')}
                            <input type="file" hidden accept="image/*,.pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        props.onFileUpload('bankConfirmationFile', file);
                                        setDetails({ ...details, bankConfirmationFileName: file.name, bankConfirmationFileUploaded: true });
                                    }
                                }}
                            />
                        </Button>
                        {(details.bankConfirmationFileUploaded || (details.bankConfirmationFile && details.bankConfirmationFile !== 'null')) && (
                            <Button size="small" variant="text"
                                sx={{ color: details.bankConfirmationFileUploaded ? '#388E3C' : '#666', fontSize: '0.75rem', minWidth: 'auto' }}
                                onClick={() => {
                                    if (details.bankConfirmationFileUploaded) {
                                        const file = props.filesRef?.current?.bankConfirmationFile;
                                        if (file) window.open(URL.createObjectURL(file), '_blank');
                                    } else {
                                        window.open(`http://localhost:3002/${details.bankConfirmationFile.replace(/\\/g, '/')}`, '_blank');
                                    }
                                }}
                            >
                                {details.bankConfirmationFileUploaded ? '● Preview New File' : '○ View Saved File'}
                            </Button>
                        )}
                    </Stack>
                    {props.fileErrors?.bankConfirmationFile && (
                        <Typography variant="caption" sx={{ color: 'red', mt: 0.5, display: 'block' }}>
                            {props.fileErrors.bankConfirmationFile}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}