import { requireAuth } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => { 
  await   requireAuth()  
  redirect("/workflows")
   
}

export default page