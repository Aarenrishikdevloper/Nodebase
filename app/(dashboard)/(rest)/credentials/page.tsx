import { CredentiaList, CredentialsContainer, CredentialsError, CredentialsLoader } from '@/features/crudential/conponets/credentials'
import { CredentialsParamsLoader } from '@/features/crudential/server/params-loader'
import { prefetchCredentials } from '@/features/crudential/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { SearchParams } from 'nuqs'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
type props ={
  searchParams:Promise<SearchParams>
}
const page = async({searchParams}:props) => {
  await requireAuth() 
  const params = await CredentialsParamsLoader(searchParams)    
  prefetchCredentials(params)
  return (
    <CredentialsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsError/>}>
             <Suspense fallback={<CredentialsLoader/>}>
                 <CredentiaList/>
             </Suspense>
          </ErrorBoundary>
        </HydrateClient>
    </CredentialsContainer>
  )
}

export default page