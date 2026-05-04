import { createSlice, current } from "@reduxjs/toolkit"
import swal from 'sweetalert'

const initialState = {
    current: {},
    manager: '040802001',
    isAuthChecked: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrent: (state, action) => {
            state.current = action.payload;
        },
        logout: (state) => {
            state.current = null;
        },
        setAuthChecked: (state, action) => {
            state.isAuthChecked = action.payload;
        }
    }
}
)
export const { add, setCurrent, logout, setAuthChecked } = userSlice.actions
export default userSlice.reducer

