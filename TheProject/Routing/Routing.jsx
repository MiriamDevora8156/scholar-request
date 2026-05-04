import { Route, Routes } from "react-router"
import { Home } from "../Components/Home"
import { Enter } from "../Components/Enter"
import { RequestForm } from "../Components/RequestForm"
import { Status } from "../Components/Status"
import { ViewRequest } from "../Components/ViewRequest"
import { Login } from "../Components/Login"
import { RequestDetails } from "../Components/RequestDetails"
import { PersonalDetails } from "../Components/Form/PersonalDetails"
import { FamilyDetails } from "../Components/Form/FamilyDetails"
import { Studies } from "../Components/Form/Studies"
import { BankDetails } from "../Components/Form/BankDetails"
import { Verify } from "../Components/Form/Verify"
import { Apply } from "../Components/Form/Apply"


export const Routing = () => {

    return <>
        <Routes>
            <Route path="home" element={<Home></Home>} ></Route>
            <Route path="login" element={<Login></Login>} ></Route>
            <Route path="enter" element={<Enter></Enter>}>
            </Route>
            <Route path="requestForm" element={<RequestForm></RequestForm>}>
                <Route path="PersonalDetails" element={<PersonalDetails></PersonalDetails>} ></Route>
                <Route path="FamilyDetails" element={<FamilyDetails></FamilyDetails>} ></Route>
                <Route path="Studies" element={<Studies></Studies>} ></Route>
                <Route path="BankDetails" element={<BankDetails></BankDetails>} ></Route>
                <Route path="Verify" element={<Verify></Verify>} ></Route>
            </Route>
            <Route path="apply" element={<Apply></Apply>}></Route>
            <Route path="status" element={<Status></Status>}></Route>
            <Route path="viewRequest" element={<ViewRequest></ViewRequest>}></Route>
            <Route path="RequestDetails/:requestId" element={<RequestDetails></RequestDetails>}></Route>
            <Route path="" element={<Home></Home>}></Route>
        </Routes>
    </>

}