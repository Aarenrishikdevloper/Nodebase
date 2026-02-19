import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader , DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCredentialsByType } from '@/features/crudential/hooks/use-credential';
import { CredentialsType } from '@/type/type';
import { zodResolver } from '@hookform/resolvers/zod';

import Image from 'next/image';

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
export const formSchema = z.object({
  variableName: z
    .string()
    .min(1, {
      message: "variable name is required",
    })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters,numbers and underscores",
    }),
  username:z.string().optional(),
  content: z.string().min(1 , "Message Content is required").max(2000, "Discord message annot exceed 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
});

export type anthropciFormValues = z.infer<typeof formSchema>;

export interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<anthropciFormValues>;
}


const DisCordDaialog = ({
    open, 
    onOpenChange, 
    onSubmit, 
    defaultValues
}:Props) => {  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),  
    defaultValues:{
       variableName:defaultValues?.variableName || '',  
       username:defaultValues?.username || "",  
       content:defaultValues?.content || '',  
       webhookUrl:defaultValues?.webhookUrl || '',
    }
  })   
    useEffect(() => {
       if(open){ 
        console.log(defaultValues)
         form.reset({
          variableName:defaultValues?.variableName || "",  
          username:defaultValues?.username || "",  
          content:defaultValues?.content || "", 
          webhookUrl:defaultValues?.webhookUrl || ''
         })
       }
    }, [open, defaultValues, form])
  const watchVariableName = form.watch("variableName") || "myDiscord"   
    const handleSubmit =(values:z.infer<typeof formSchema>)=>{  
      onSubmit(values)    
      onOpenChange(false)
  
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>    
       <DialogContent className='max-h-[90vh] overflow-y-auto flex flex-col'> 
        <DialogHeader>
           <DialogTitle>Discord Configuration</DialogTitle>      
           <DialogDescription>
             Configure the Discord webhook  settings for this node
           </DialogDescription>

        </DialogHeader>     
        <div className="flex-1 overflow-y-auto  pr-2 no-scrollbar">
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(handleSubmit)} className=' space-y-8 mt-4'>
                <FormField
                    control={form.control}
                    name="variableName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variable Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="myDiscord"
                            {...field} 
                            value={field.value || ""}   
                          />
                        </FormControl>  
                        <FormDescription>
                           Use this name to reference the result in the other node:{" "}   
                           {"  "}  
                           {`{{${watchVariableName}.text}}`}
                        </FormDescription>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />  
                 <FormField
                    control={form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                          <FormControl>
                            <Input    
                               placeholder='http://discord.com/api/webhooks/....'   
                               {...field}
                            />
                          </FormControl>
                        <FormDescription >
                            Get This from Discord: Channel Settings -{">"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}   
                  />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea    
                          className='min-h-[80px] font-mono text-sm'
                           placeholder='Summary:{{myGemini.text}}'
                            {...field} 
                            value={field.value || ""}   
                          />
                        </FormControl>  
                        <FormDescription>
                              Sets the behaviour of the assistant.Use  {"{{variables}}"} for    
                             simple values or {"{{json variable}}"} to strignify object
                        </FormDescription>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />         
                     <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot username(Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder='workflow bot' {...field}/>       
                        </FormControl>  
                        <FormDescription>
                           Override the webhook's default username
                        </FormDescription>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />      
                 <DialogFooter className='mt-4'>  
                   <Button type={"submit"}>   
                       Save
                     
                   </Button>
                  </DialogFooter> 
                        


                  
          </form>

        </Form> 
        </div>
           
       </DialogContent>

    </Dialog>
  )
}

export default DisCordDaialog