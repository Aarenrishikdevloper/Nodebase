
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCredentialsByType } from '@/features/crudential/hooks/use-credential';
import { CredentialsType } from '@/type/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
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
  endpoint: z.string().min(1, { message: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  body: z.string().optional()
});

export type HTTPRequestFormValues = z.infer<typeof formSchema>;

export interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HTTPRequestFormValues>;
}


const HttpRequestDaialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || '',
      endpoint: defaultValues?.endpoint,
      method: defaultValues?.method || 'GET',
      body: defaultValues?.body || '',
    }
  })
  const watchVariableName = form.watch("variableName") || "myApiCall"
  const watchmethod = form.watch("method")
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchmethod)
    const handleSubmit =(values:z.infer<typeof formSchema>)=>{  
      onSubmit(values)    
      onOpenChange(false)
  
    }  
        useEffect(() => {
           if(open){
             form.reset({
              variableName:defaultValues?.variableName || "",  
              method:defaultValues?.method || "GET",  
              endpoint:defaultValues?.endpoint || "", 
              body:defaultValues?.body || ''
             })
           }
        }, [open, defaultValues, form])   
        
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto flex flex-col '>
        <DialogHeader>
          <DialogTitle> HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP Request node.
          </DialogDescription>

        </DialogHeader>
        <div className='flex-1 overflow-y-auto  pr-2 no-scrollbar'>
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
                        placeholder="myApicall"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Use this name to reference the result in the other node:{" "}
                      {"  "}
                      {`{{${watchVariableName}.httpResponse.data}}`}
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mehods</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a method" />

                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='GET'> GET</SelectItem>
                        <SelectItem value='POST'> POST</SelectItem>
                        <SelectItem value='PUT'> PUT</SelectItem>
                        <SelectItem value='PATCH'> PATCH</SelectItem>
                        <SelectItem value='DELETE'>DELETE</SelectItem>
                      </SelectContent>

                    </Select>

                    <FormDescription  >The Http method to use for this request</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='http://localhost:3000/api'
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription >
                      Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"} to strignify objects
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {showBodyField && (
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Body</FormLabel>
                      <FormControl>
                        <Textarea
                          className='min-h-[120px] font-mono text-sm w-full'
                          placeholder={`{ 
                              "userId:"{httpResponse.data.id}", 
                              "name":"{httpResponse.data.name}", 
                              "items":"{httpResponse.data.items}"
                            }`}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        JSON with template variables. Use {"{{variables}}"} for  simple values or {"{{json variables}}"} to strignify objects
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className='mt-4'>
                <Button variant={'outline'} type={'button'} onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
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

export default HttpRequestDaialog