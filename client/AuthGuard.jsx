import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrent, setAuthChecked } from "./Redux/userSlice";
import API from "./api";

export const AuthGuard = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await API.get('/auth/check-auth');
                if (response.data.user) {
                    dispatch(setCurrent(response.data.user));
                }
            } catch (err) {
                console.log("No valid session found");
            } finally {
                dispatch(setAuthChecked(true));
            }
        };
        checkAuth();
    }, [dispatch]);

    return children;
};