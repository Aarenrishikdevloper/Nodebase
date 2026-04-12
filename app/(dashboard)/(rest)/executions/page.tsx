import { ExecutionContainer, ExecutionError, ExecutionList, ExecutionLoader } from '@/features/execution/execution'
import { HydrateClient } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'
import { SearchParams } from 'nuqs'
import { requireAuth } from '@/lib/auth-utils'
import { executionLoaderParams } from '@/features/execution/server/params-loader'
import { prefechExecutions } from '@/features/execution/server/prefetch'
type props ={
    searchParams:Promise<SearchParams>
}
const page = async({searchParams}:props) => { 
    await requireAuth() 
    const params = await executionLoaderParams(searchParams)    
    prefechExecutions(params)
  return (
    <ExecutionContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<ExecutionError/>}>   
            <Suspense fallback={<ExecutionLoader/>}>    
            <ExecutionList/>

            </Suspense>

            </ErrorBoundary>
        </HydrateClient>
    </ExecutionContainer>
  )
}

export default page