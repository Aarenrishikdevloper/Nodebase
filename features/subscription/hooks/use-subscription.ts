import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { sub } from "date-fns"

export const  useSubscription =()=>{
    return useQuery({
        queryKey:[
            'subscription'
        ], 
        queryFn:async()=>{
            const {data} = await authClient.customer.state() 
            return data ?? null
        }, 
    
    })
}   
export const useHasActiveSubscription =()=>{
    const {data:customerState, isLoading, ...rest} = useSubscription();  
    const hasActiveSubscription = customerState?.activeSubscriptions.some((sub)=>sub.status=== "active")?? false;
    return{
        hasActiveSubscription,  
        subscription:customerState?.activeSubscriptions?.[0],  
        isLoading, 
        ...rest
    }
}