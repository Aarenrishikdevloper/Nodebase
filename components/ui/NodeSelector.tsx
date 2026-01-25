import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet'  
import { NodeType } from '@/type/type'
import { GlobeIcon, icons, MousePointerIcon } from 'lucide-react'
import { Separator } from './separator'

interface NodeSelectorProps {
    open:boolean, 
    onOpenChange:(open:boolean)=>void 
    children:React.ReactNode
}

export type NodeTypeOptions = {
  type: NodeType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }> | string
}   
const triggerNodes: NodeTypeOptions[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Run the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description:
      "Runs the flow when a Google Form is submitted",
    icon: "/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description:
      "Runs the flow when a Stripe Event is captured",
    icon: "/stripe.svg",
  },
]

const executionNodes: NodeTypeOptions[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google to generate text",
    icon: '/gemini.svg',
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Uses OpenAI to generate text",
    icon: '/openai.svg',
  },
  {
    type: NodeType.DEEPSEEK,
    label: "Deepseek",
    description: "Uses Anthropic to generate text",
    icon: '/deepseek.svg',
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a message to Discord",
    icon: '/discord.svg',
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a message to Slack",
    icon: '/slack.svg',
  },
]


export const NodeSelector = ({open,onOpenChange,children}:NodeSelectorProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>    
    <SheetTrigger asChild>{children}</SheetTrigger>   
    <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto'>
          <SheetHeader>
             <SheetTitle>What triggers this workflow?</SheetTitle>  
             <SheetDescription>
               A Trigger is a step that starts your workflow
             </SheetDescription>
          </SheetHeader>  
          <div className='mt-4 space-y-2'>
              {triggerNodes.map((nodetype)=>{
                 const Icon = nodetype.icon; 
                 return(
                   <div key={nodetype.label} className='w-full flex items-center gap-4 p-4 rounded-md cursor-pointer  border-l-2 border-transparent  hover:border-l-primary transition'>   
                     {typeof Icon === "string" ?(
                       <img   
                          src={Icon}  
                          alt={nodetype.label}  
                          className='size-5 object-contain  rounded-sm'
                       />
                     ):(
                        <Icon className='size-5'/>
                     )}
                      <div className='flex flex-col  items-start'> 
                        <span className=' font-medium text-sm'>   
                          {nodetype.label}

                        </span>  
                        <div className='text-sm text-muted-foreground'>
                             {nodetype.description}
                        </div>

                      </div>
                   </div>

                 )
              })}
          </div>  
          <Separator/>    
          <div className='mt-4 space-y-2'>
              {executionNodes.map((nodetype)=>{
                 const Icon = nodetype.icon; 
                 return(
                   <div key={nodetype.label} className='w-full flex items-center gap-4 p-4 4ounded-md cursor-pointer  border-l-2 border-transparent  hover:border-l-primary transition'>   
                     {typeof Icon === "string" ?(
                       <img   
                          src={Icon}  
                          alt={nodetype.label}  
                          className='size-5 object-contain  rounded-sm'
                       />
                     ):(
                        <Icon className='size-5'/>
                     )}
                      <div className='flex flex-col  items-start'> 
                        <span className=' font-medium text-sm'>   
                          {nodetype.label}

                        </span>  
                        <div className='text-sm text-muted-foreground'>
                             {nodetype.description}
                        </div>

                      </div>
                   </div>

                 )
              })}
          </div>  
          
    </SheetContent>

    </Sheet>
  )
}
