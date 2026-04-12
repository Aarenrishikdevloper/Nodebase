'use client';
import React, { useState } from 'react'
import { useSuspenseExecution } from './hooks/use-execution'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { executionStatusEnum } from '@/lib/db/schema'
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { duration } from 'drizzle-orm/gel-core'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
type ExecutionStatustype = (typeof  executionStatusEnum.enumValues[number] )   
const getStatusIcon = (status: ExecutionStatustype) =>
  ({
    RUNNING:   <Loader2Icon className="size-5 text-blue-600 animate-spin" />,
    COMPLETED: <CheckCircle2Icon className="size-5 text-green-600" />,
    FAILED:    <XCircleIcon className="size-5 text-red-600" />,
    CANCELLED: <ClockIcon className="size-5 text-muted-foreground" />,   
  } as Record<ExecutionStatustype, React.ReactElement>)[status];   
  const formatStatus =(status:ExecutionStatustype)=>{
    return status.charAt(0) + status.slice(1).toLowerCase()
}
const ExecutionView = ({executionId}:{executionId:string}) => { 
    const [showStackTrace, setShowTrace] = useState(false)
    const{data:execution} = useSuspenseExecution(executionId)     
     const duration = execution.completedAt ? Math.round(new Date(execution.completedAt!).getTime() - new Date(execution.startedAt).getTime()) / 1000 : null
  return (
    <Card className='shadow-none'>  
      <CardHeader> 
          <div className='flex items-center gap-3'>  
              {getStatusIcon(execution.status)}  
              <div>
                <CardTitle>
                    {formatStatus(execution.status)}
                </CardTitle>    
                <CardDescription>
                    Execution for {execution.workflow.name}
                </CardDescription>  
              </div>

          </div> 
          <CardContent className=' space-y-4'>   
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className='text-sm font-medium text-muted-foreground'>  
                        Workflow
 
                    </p> 
                    <Link prefetch className='text-sm hover-underline text-primary' href={`/workflows/${execution.workflowId}`}>     
                       {execution.workflow.name}
                    </Link>
                </div>  
                <div>
                    <p className=' text-sm font-medium text-muted-foreground'>   
                        Status

                    </p> 
                    <p className=' text-sm'>
                        {formatStatus(execution.status)}
                    </p>
                </div>   
                 <div>
                    <p className=' text-sm font-medium text-muted-foreground'>   
                        Started

                    </p> 
                    <p className=' text-sm'>
                        {formatDistanceToNow(execution.startedAt, {addSuffix:true})}
                    </p>
                </div> 
                {execution?.completedAt !== null?(
                     <div>   
                        <p className=' text-sm font-medium text-muted-foreground'>   
                        Completed

                    </p> 
                    <p className=' text-sm'>
                        {formatDistanceToNow(execution.completedAt!, {addSuffix:true})}
                    </p>

                     </div>
                ):null}       
                {duration !== null ?(
                    <div>
                     <p className=' text-sm font-medium text-muted-foreground'>   
                        Duration

                    </p> 
                    <p className=' text-sm'>
                        {duration}s
                    </p> 
                    </div>
                ):null} 
                <div>
                    <p className=' text-sm font-medium text-muted-foreground'>   
                        Event ID

                    </p> 
                    <p className=' text-sm'>
                        {execution.inngestEventId}
                    </p> 
                </div>  
                </div>
                {execution.errorStack && (
                    <div className="mt-6 p-4 bg-red-60 rounded-md space-y-3">
                        <div>
                             <p className=' text-sm font-medium text-red-900 mb-2'>   
                          Error

                    </p> 
                    <p className=' text-sm text-red-800 font-mono'>
                        {execution.errorStack}
                    </p> 
                        </div> 
                        {execution.errorStack && (
                            <Collapsible open={showStackTrace} onOpenChange={setShowTrace}>  
                             <CollapsibleTrigger asChild> 
                                <Button>
                                   {showStackTrace?"Hide stack trace":"Show stack trace"}
                                </Button>
                             </CollapsibleTrigger> 
                             <CollapsibleContent> 
                               <pre className='text-xs font-mono text-red-800 overflow-auto  mt-2 p-2  bg-red-100 rounded'>
                                   {execution.errorStack}
                               </pre>
                             </CollapsibleContent>
                              
                            </Collapsible>
                        )} 

                    </div>
                )} 
                
                
                {execution.output !== null ?(
                    <div className="mt-6 p-4 bg-muted rounded-md">
                        <p className='text-sm font-medium mb-2'>
                              Output
                        </p> 
                        <pre className='text-xs font-mono  overflow-auto'>   
                            {JSON.stringify(execution.output, null , 2)}

                        </pre>
                    </div>
                ):null}
                

              


          </CardContent>

      </CardHeader>

    </Card>
  )
}

export default ExecutionView