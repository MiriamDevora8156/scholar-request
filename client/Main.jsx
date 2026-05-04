import { BrowserRouter } from "react-router"
import { Nav } from "./Routing/Nav"
import { Routing } from "./Routing/Routing"
// import './bootstrap.min.css'
import './style.css'
import { Provider, useDispatch, useSelector } from "react-redux"
import store from "./Redux/Store"
import { AuthGuard } from "./AuthGuard"


export const Main = () => {


    return <>
        <BrowserRouter>
            <Provider store={store}>
                <AuthGuard>
                    <Nav></Nav>
                    <Routing></Routing>
                </AuthGuard>
            </Provider>
        </BrowserRouter>
    </>
}