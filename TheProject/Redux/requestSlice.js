import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit"
import API from '../api'

const initialState = {
    list: [],
    current: {
        personal: {},
        family: {},
        course: {},
        bank: {}
    },
    filters: {
        id: '',
        city: '',
        minSiblings: '',
        minSalary: '',
        fromDate: '',
        toDate: '',
        sortBy: 'submissionDate',
        order: 'desc'
    },
    isFilterLocked: false,
}

export const saveDraftToDB = createAsyncThunk(
    'request/saveDraft',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { current } = getState().request;
            const response = await API.post('/requests/draft-text', current);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'שגיאה בשמירת טיוטה');
        }
    }
);

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        resetCurrentRequest: (state) => {
            state.current = {
                personal: {},
                family: {},
                course: {},
                bank: {}
            }
        },
        personal: (state, action) => { state.current.personal = action.payload },
        family: (state, action) => { state.current.family = action.payload },
        course: (state, action) => { state.current.course = action.payload },
        bank: (state, action) => { state.current.bank = action.payload },
        setAllRequests: (state, action) => {
            state.list = action.payload;
        },
        updateRequestInList: (state, action) => {
            const { id, status } = action.payload;
            const index = state.list.findIndex(req => req._id === id);
            if (index !== -1) {
                state.list[index].status = status;
            }
        },
        requestCurrent: (state, action) => {
            state.current = action.payload ?? {
                personal: {},
                family: {},
                course: {},
                bank: {}
            }
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        setFilterLocked: (state, action) => {
            state.isFilterLocked = action.payload;
        },
    }
})

export const {
    personal, family, course, bank,
    setAllRequests, updateRequestInList, resetCurrentRequest, requestCurrent,
    setFilters, setFilterLocked
} = requestSlice.actions;

export default requestSlice.reducer;

export const selectPendingRequests = createSelector(
    state => state.request.list,
    list => list
);