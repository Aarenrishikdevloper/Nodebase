import { useQueryStates } from "nuqs"
import { executionParams } from "../server/params"

export const useExecutionParams = ()=>{
    return useQueryStates(executionParams);
}