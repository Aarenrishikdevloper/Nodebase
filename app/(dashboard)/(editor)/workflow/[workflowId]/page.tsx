import { EditorHeader } from '@/features/editor/components/editor'
import { prefetchWorkflow } from '@/features/workflow/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
interface PageProps {
    params:Promise<{
        workflowId:string
    }>
}
const Page = async({params}:PageProps) => {  
    await requireAuth()  
    const {workflowId} = await params   
    prefetchWorkflow(workflowId)
  return (
    <HydrateClient>
        <ErrorBoundary fallback={<p>Something Went Wrong</p>}>
          <Suspense fallback={<p>loading...</p>}>    
            <EditorHeader workflowId={workflowId}/>

          </Suspense>
        </ErrorBoundary>
    </HydrateClient>
  )
}

export default Page
