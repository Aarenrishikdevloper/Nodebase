'use cleint';
import { EntityContainer, EntityHeaders } from '@/components/ui/entity-view'
import React from 'react'

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
    >
        {children}
    </EntityContainer>
}