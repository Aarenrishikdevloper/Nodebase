import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription ,DialogHeader} from '@/components/ui/dialog';
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
  credentialId:z.string().min(1,"Credential is required") ,
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User Prompt Required"),
});

export type anthropciFormValues = z.infer<typeof formSchema>;

export interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<anthropciFormValues>;
}


const DeepSeekDaialog = ({
    open, 
    onOpenChange, 
    onSubmit, 
    defaultValues
}:Props) => {  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),  
    defaultValues:{
       variableName:defaultValues?.variableName || '',  
       credentialId:defaultValues?.credentialId || "",  
       systemPrompt:defaultValues?.systemPrompt || '',  
       userPrompt:defaultValues?.userPrompt || '',
    }
  }) 
  const watchVariableName = form.watch("variableName") || "myDeepseekAPI"   
  const {data:credentials, isLoading:isloadingCredential} = useCredentialsByType(CredentialsType.DEEPSEEK) 
  const handleSubmit =(values:z.infer<typeof formSchema>)=>{  
    onSubmit(values)    
    onOpenChange(false)

  }   
  useEffect(() => {
     if(open){
       form.reset({
        variableName:defaultValues?.variableName || "",  
        credentialId:defaultValues?.credentialId || "",  
        systemPrompt:defaultValues?.systemPrompt || "", 
        userPrompt:defaultValues?.userPrompt || ''
       })
     }
  }, [open, defaultValues, form])
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>    
       <DialogContent className='max-h-[90vh] overflow-y-auto flex flex-col'> 
        <DialogHeader>
           <DialogTitle>Deepseek Configuration</DialogTitle>    
            <DialogDescription>Configure AI model and prompt for this node</DialogDescription>
        </DialogHeader>   
        <div className="flex-1 overflow-y-auto  pr-2 no-scrollbar">
        <Form {...form} >     
          
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
                            placeholder="myApiCall"
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
                    name="credentialId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deepseek Credentials</FormLabel>
                        <Select  onValueChange={field.onChange} defaultValue={field.value} disabled={isloadingCredential  || !credentials?.length}>         
                             <FormControl>
                             <SelectTrigger className="w-full">    
                                <SelectValue/>

                             </SelectTrigger>
                          </FormControl>       
                          <SelectContent>
                            {credentials?.map((option)=>(
                                <SelectItem key={option.id} value={option.id}>     
                                   <div className=" flex items-center gap-2">   
                                     <Image
                                       src={'/deepseek.svg'}   
                                       alt={"logo"}  
                                       height={16}  
                                       width={16}
                                     />
                                     {option.name}

                                   </div>

                                </SelectItem>
                            ))}
                          </SelectContent>

                        </Select>

                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}   
                  />
                <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Syatem Prompt</FormLabel>
                        <FormControl>
                          <Textarea    
                          className='min-h-[80px] font-mono text-sm'
                           placeholder='You are  a helpful assistant'
                            {...field} 
                            value={field.value || ""}   
                          />
                        </FormControl>  
                        <FormDescription>
                          Sets the behaviour of the assistant.Use  {"{{variables}}"} for    
                          simple values or {"{{json variable}}"} to strignofy object
                        </FormDescription>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />         
                     <FormField
                    control={form.control}
                    name="userPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User  Prompt</FormLabel>
                        <FormControl>
                          <Textarea    
                          className='min-h-[120px] font-mono text-sm'
                           placeholder='Summarize  this text:{{json httpResponse.data}}'
                            {...field} 
                            value={field.value || ""}   
                          />
                        </FormControl>  
                        <FormDescription>
                          The propmt to send to the AI,Use  {"{{variables}}"} for    
                          simple values or {"{{json variable}}"} to strignofy object
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

export default DeepSeekDaialog