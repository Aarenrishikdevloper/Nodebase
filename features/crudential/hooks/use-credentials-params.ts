import { useQueryStates } from "nuqs"
import { CredentialParams } from "../params"

export const useCredentialsParams =()=>{
    return useQueryStates(CredentialParams)
}