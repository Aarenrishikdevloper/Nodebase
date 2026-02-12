'use client';
import { EmptyView, EntityContainer, EntityHeaders, EntityItem, EntityList, EntityPagination, EntitySearch, ErroView, LoadingView } from '@/components/ui/entity-view'
import { credentials, credentialTypeEnum } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import Image from 'next/image';
import React from 'react'
import { useRemoveCredentials, useSuspenseCredentials } from '../hooks/use-credential';
import { useCredentialsParams } from '../hooks/use-credentials-params';
import { useRouter } from 'next/navigation';
import { useEntitySearch } from '../hooks/use-search';

export const CredentialsHeader = ({disabled}:{disabled?:boolean}) => {
  return (
    < EntityHeaders    
        title='Credentials' 
        description='Create and manage your Credentials'   
        newButtonHref='/credentials/new' 
        newButtonLabel='New Credentials'     
        disabled={disabled}
    />
  )
}
export const CredentialsContainer =({children}:{children:React.ReactNode})=>{
    return <EntityContainer  
      header={<CredentialsHeader/>} 
      pagination={<CredentialPagination/>} 
      search={<CredentialsSearch/>}
    >
        {children}
    </EntityContainer>
}    
type credential = InferSelectModel<typeof credentials>     
type credentialTtype = (typeof credentialTypeEnum.enumValues)[number]
const credentialslogos :Record<credentialTtype, string>={
    OPENAI: "/openai.svg",
  ANTHROPIC: "/anthropic.svg",
  DEEPSEEK: "/deepseek.svg",
  GEMINI: "/gemini.svg",
}
export const CredentialsItem =({data}:{data:credential})=>{ 
  const logo = credentialslogos[data.type] || "/openai.svg"  
  const removeCredentials = useRemoveCredentials() 
  const handleRemove =()=>{
    removeCredentials.mutate({id:data.id})
  }
  return <EntityItem   
      href={`/credentials/${data.id}`}   
      title={data.name}   
      subtitle={
         <> 
           Updated {formatDistanceToNow(data.updatedAt ,{addSuffix:true})}  {" "}   
           &bull; Created {" "}   
           {formatDistanceToNow(data.createdAt, {addSuffix:true})}

         </>
      }     
      image={
         <div className="size-8 flex items-center  justify-center">
           <Image src={logo} alt={data.name} width={20} height={20}/>
         </div>
      } 
      onRemove={handleRemove}     
      isRemoving={removeCredentials.isPending}


  />
}  
export const CredentiaList =()=>{ 
  const credentrial  = useSuspenseCredentials()
  return <EntityList  
    items={credentrial.data.items}  
    getKey={(credentials)=>credentials.id}   
    renderItem={(credentials)=><CredentialsItem data={credentials}/>}  
    emptyView={<CredentialEmpty/>}
  />
} 
export const CredentialPagination =()=>{
  const credentials = useSuspenseCredentials() 
  const [params, setparams] = useCredentialsParams() 
  return <EntityPagination   
     disabled={!credentials.isFetched}   
     totalpage={credentials.data.totalPages || 1}  
     page={credentials.data.page || 1}  
     onPageChange={(page)=>setparams({...params, page})}

  />
} 
export const CredentialEmpty =()=>{  
     
  const router = useRouter();
  const handleCreate = () => {  
    router.push('/credentials/new')
  }
   return(
     <> 
       <EmptyView onNew={handleCreate} message="You haven't created any credentials yet. Get started by creating your first credentials"/>
     </>
   )
}  
export const CredentialsError =()=>{
   return <ErroView message="Error Loading Credentials...."/>  

}   
export const CredentialsLoader =()=>{
  return <LoadingView message="Loading Credentials...."/>
}   
export const CredentialsSearch =()=>{ 
  const [params, setParams] = useCredentialsParams()  
  const {searchValue, onSearchChange} = useEntitySearch({
    params, 
    setParams
  })
  return <EntitySearch   
     placeholder='Search Credentials'   
     onChange={onSearchChange}   
     value={searchValue}
     
  />
}