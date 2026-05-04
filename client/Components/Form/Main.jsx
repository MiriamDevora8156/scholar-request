import { useState } from "react"
import { BankDetails } from "./BankDetails"
import { FamilyDetails } from "./FamilyDetails"
import { MultiForm } from "./MultiForm"
import { PersonalDetails } from "./PersonalDetails"
import { Studies } from "./Studies"
import { Verify } from "./Verify"

export const Main = () => {


    return <>
        <MultiForm>
            <PersonalDetails ></PersonalDetails>
            <FamilyDetails></FamilyDetails>
            <Studies></Studies>
            <BankDetails></BankDetails>
            <Verify></Verify>
        </MultiForm>
    </>
}