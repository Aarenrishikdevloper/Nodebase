'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CopyIcon } from 'lucide-react'
import { useParams } from 'next/navigation'

import React from 'react'
import toast from 'react-hot-toast'
type props = {
  open: boolean,
  onOpenChange: (open: boolean) => void
}
export const StripeTriggerDialog = ({ open, onOpenChange }: props) => {

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const params = useParams()
  const workflowId = params.workflowId as string
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`  
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Stripe Trigger Configuration
          </DialogTitle>
          <DialogDescription>
            Configure this webhook URl in your Stripe DashBoard to trigger  yhis Workflow on payment Satatus
          </DialogDescription>

        </DialogHeader>
        <div className=' space-y-4'>
          <div className="space-y-2">
            <label htmlFor='webhook-url'>
              Webhook Url
            </label>
            <div className='flex gap-2'>
              <Input id="webhook-url" value={webhookUrl} readOnly className='font-mono text-sm' />
              <Button onClick={copyToClipboard} type={'button'} variant={'outline'} >
                <CopyIcon className='size-4' />
              </Button>
            </div>

          </div>
          <div className='rounded-lg bg-muted p-4 space-y-2'>
            <h4 className='font-medium text-sm '>
              Setup instruction:
            </h4>
            <ol className='text-sm text-muted-foreground  space-y-1  list-decimal  list-inside'>
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers -&gt; Webhooks </li>
              <li> Click "Add endpoint"</li>
              <li>Pase the webhook URL above</li>
              <li>Select events to listen for(e.g., payment_intent.succeeded) </li>
              <li>Save and copy the signing secret </li>
            </ol>

          </div>
          <div className='rounded-lg  bg-muted  p-4 space-y-2'>
            <h4 className='font-medium text-sm'>
              Avalaible Variables

            </h4>
            < ul className='text-sm text-muted-foreground  space-y-1'>
              <li>
                <code className='bg-background px-1 py-0.5 rounded'>
                  {"{{stripe.amount}}"}

                </code>
                - Payment amount

              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>
                - Currency Code
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>
                - Full event data as JSON
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>
                - Event type (e.g., Payment_intent.succeeded)
              </li>

            </ul>

          </div>

        </div>
      </DialogContent>

    </Dialog>
  )
}
