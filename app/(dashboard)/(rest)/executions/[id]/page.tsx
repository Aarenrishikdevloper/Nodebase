import { ExecutionError, ExecutionLoader } from '@/features/execution/execution'
import ExecutionView from '@/features/execution/execution-view'
import { prefetchExecution } from '@/features/execution/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
interface PageProps{
    params:Promise<{
        id:string
    }>
}
 const page = async({params}:PageProps) => {  
    await requireAuth()   
    const {id} = await params  
    prefetchExecution(id)   
    

  return (
    <div className='p-4 md:px-20 md:py-6 h-full'> 
      <div className=" mx-auto max-w-3xl w-full flex flex-col  gap-y-8 h-full">
        <HydrateClient>
            <ErrorBoundary fallback={<ExecutionError/>}>  
               <Suspense fallback={<ExecutionLoader/>}>    
                   <ExecutionView executionId={id}/>  

               </Suspense>

            </ErrorBoundary>
        </HydrateClient>
      </div>

    </div>
  )
}
export default page