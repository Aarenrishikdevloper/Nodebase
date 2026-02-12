import { CredentialView } from '@/features/crudential/conponets/credential'
import { CredentialsError, CredentialsLoader } from '@/features/crudential/conponets/credentials'
import { prefetchCredential } from '@/features/crudential/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
interface pageProps {
    params:Promise<{
        id:string
    }>
}
const page = async({params}:pageProps) => { 
    await requireAuth()    
    const {id} = await params  
    prefetchCredential(id)
  return (
    <div className='p-4 md:px-10 md:py-6 h-full'> 
    <div className="mx-auto max-w-3xl w-full flex flex-col  gap-y-8 h-full">
      <HydrateClient>
         <ErrorBoundary fallback={<CredentialsError/>}>  
         <Suspense fallback={<CredentialsLoader/>}>    
         <CredentialView  id={id}/>

         </Suspense>

         </ErrorBoundary>
      </HydrateClient>
    </div>
 
    </div>
  )
}

export default page