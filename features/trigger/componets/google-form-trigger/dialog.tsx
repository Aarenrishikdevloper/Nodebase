import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CopyIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { generateGoogleFormScript } from './utils'
import toast from 'react-hot-toast'
type props={
    open:boolean,   
    onOpenChange:(open:boolean)=>void
}
export const GoogleFormDialog = ({open,onOpenChange}:props) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const params = useParams()
  const workflowId = params.workflowId as string
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}` 
  const hanldleGnerate = async()=>{
       const script = generateGoogleFormScript(webhookUrl)   
       try {
           await navigator.clipboard.writeText(script) 
           toast.success("Script Copied Sucessfully")
       } catch (error) {
            toast.error("Faiuled to copy Script to clipboard")
    
  }    
  
} 
const copyToClipboard  = async()=>{
    try {
         await navigator.clipboard.writeText(webhookUrl)  
         toast.success("Webhook Url Sucessfully")
    } catch (error) {
           toast.error("Something went wrong")
    }
}
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto flex flex-col'>
        <DialogHeader>
          <DialogTitle>
            Google Form  Configuration
          </DialogTitle>
          <DialogDescription>
             Use this webhook Url  in your Googel Form's App Script to trigger  this workflow when a form is submitted
          </DialogDescription>

        </DialogHeader>
        <div className="flex-1 overflow-y-auto  pr-2 no-scrollbar">
        <div className=' space-y-4'>
          <div className="space-y-2">
            <label htmlFor='webhook-url'>
              Webhook Url
            </label>
            <div className='flex gap-2'>
              <Input id="webhook-url" value={webhookUrl} readOnly className='font-mono text-sm' />
              <Button type={'button'} variant={'outline'} onClick={copyToClipboard} >
                <CopyIcon className='size-4' />
              </Button>
            </div>

          </div>
          <div className='rounded-lg bg-muted p-4 space-y-2'>
            <h4 className='font-medium text-sm '>
              Setup instruction:
            </h4>
            <ol className='text-sm text-muted-foreground  space-y-1  list-decimal  list-inside'>
               <li>Open your Google Form</li>
                            <li>Click the three dots menu -&gt; Script editor </li>
                            <li> Copy and paste the script below</li>
                            <li> Replace WEBHOOK_URL with your webhook URL above</li>
                            <li>Save and click "Tirgger" -&gt; Add Trigger </li>
                            <li>Choose: From from -&gt; On form submit -&gt; Save </li>
            </ol>

          </div>  
          <div className="rounded-lg bg-muted p-4 space-y-3">
             <h4 className='font-medium text-sm'>
                Google Apps Script:
             </h4>  
             <Button  
              type={'button'} 
              variant={'outline'}  
              onClick={hanldleGnerate}        
              
             >
                <CopyIcon className='size-4 mr-2'/> 
                Copy Google App Script
             </Button> 
             <p className='text-xs  text-muted-foreground'>   
                This script includes your webhook URl and handles form submission

             </p>
          </div>
          <div className='rounded-lg  bg-muted  p-4 space-y-2'>
            <h4 className='font-medium text-sm'>
              Avalaible Variables

            </h4>
            < ul className='text-sm text-muted-foreground  space-y-1'>
             <li>
                <code className='bg-background px-1 py-0.5 rounded'>
                  {"{{json googleForm.respondentEmail}}"}

                </code>
                - Respondent Email

              </li>
              <li> 
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json googleForm.responses['Question Name']}}"}
                </code>
                - Specific answer
              </li>  
              <li>
                <code className='bg-background px-1 py-0.5 rounded'>
                  {"{{json googleForm.responses}}"}
                </code>
                - All responses in JSON format
              </li>

            </ul>

          </div>

        </div>  
        </div>
      </DialogContent>

    </Dialog> 
  )
}
