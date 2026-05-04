import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

export const useSave = (saveFunc, details, setFunc) => {
    const dispatch = useDispatch()
    const detailsRef = useRef(details)
    const saveFuncRef = useRef(saveFunc)

    useEffect(() => {
        detailsRef.current = details
    })
    useEffect(() => {
        saveFuncRef.current = saveFunc
    })

    useEffect(() => {
        return () => {
            dispatch(saveFuncRef.current(detailsRef.current))
        }
    }, [])
}