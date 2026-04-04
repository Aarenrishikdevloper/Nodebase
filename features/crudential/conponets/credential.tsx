'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CredentialsType } from "@/type/type";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { useCreateCredential, useSuspenseCredential, useUpdateCredentials } from "../hooks/use-credential";
import { credentialTypeEnum } from "@/lib/db/schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { decrypt } from "@/lib/encryption";
import { useUpgrade } from "@/hooks/use-upgrade";

type CredentialType = (typeof credentialTypeEnum.enumValues)[number];

const credentialTypeMeta: Record<
  CredentialType,
  { label: string; logo: string }
> = {
  LLAMA: {
    label: "Llama",
    logo: "/meta-logo.webp",
  },
  QWEN: {
    label: "Qwen",
    logo: "/qwen.webp",
  },
  DEEPSEEK: {
    label: "DeepSeek",
    logo: "/deepseek.svg",
  },

};  
const VISIBLE_TYPES: CredentialType[] = [
  "QWEN",
  "LLAMA",
  "DEEPSEEK",
];

export const credentialTypeOptions = VISIBLE_TYPES.map((type) => ({
  value: type,
  label: credentialTypeMeta[type].label,
  logo: credentialTypeMeta[type].logo,
}));
const formSchema =  z.object(({
    name:z.string().min(1, "name Is required"), 
    type:z.enum(credentialTypeEnum.enumValues),
    value:z.string().min(1, "API Key Is reequired")
}))
    type FromValues = z.infer<typeof formSchema>  
interface  credentialFormProps{
  intialdata?:{
      id?:string; 
      name:string; 
      type:CredentialType,  
      data:string
  }
}    
export const CredentialForm =({intialdata}:credentialFormProps)=>{  
  const createCredential  = useCreateCredential()   
  const {model, handleError}  = useUpgrade()
  const router = useRouter()  
 
    const form = useForm<FromValues>({
        resolver:zodResolver(formSchema), 
        defaultValues: {
            name:intialdata?.name || "", 
            type:intialdata?.type ||credentialTypeEnum.enumValues[0],
            value:intialdata?.data || ""
        }
    })  
    const  updateCredential = useUpdateCredentials()
    const onSubmit =async(values:FromValues)=>{
       if(isEdit && intialdata.id){
         await updateCredential.mutateAsync({
          id:intialdata.id,  
          ...values
         }
           
         )
       }else{
         await createCredential.mutateAsync(values,{
          onSuccess:(data)=>{
            router.push(`/credentials`)
          }, 
          onError:(error)=>{
             console.log(error) 
             handleError(error)
          }
         })
       }
    }  
    const isEdit = !!intialdata?.id
     
    return(
      <> 
      {model}
        <Card className="shadow-none">   
         <CardHeader>
            <CardTitle>
                {isEdit ? "Edit Credential" : "Create Credentials" }
            </CardTitle> 
            <CardDescription>
                {isEdit ?"Update your new API key or credential details":"Add a new API Key or credential  to your account"}
            </CardDescription>
         </CardHeader>  
         <CardContent>
            <Form {...form}>  
                <form className="space-y-6"  onSubmit={form.handleSubmit(onSubmit)}>   
                  
                     <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="My API Key" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />  
                    <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select  onValueChange={field.onChange} defaultValue={field.value}>         
                             <FormControl>
                             <SelectTrigger className="w-full">    
                                <SelectValue/>

                             </SelectTrigger>
                          </FormControl>       
                          <SelectContent>
                            {credentialTypeOptions.map((option)=>(
                                <SelectItem key={option.value} value={option.value}>     
                                   <div className=" flex items-center gap-2">   
                                     <Image  
                                       src={option.logo}   
                                       alt={option.logo}  
                                       height={16}  
                                       width={16}
                                     />
                                     {option.value}

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
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API KEY</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="sk-...." {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />      
                  <div className="flex gap-4">  
                     <Button type={'submit'}  disabled={createCredential.isPending || updateCredential.isPending} >  
                        {isEdit ?"Update":"Create"}

                     </Button>    
                     <Button type={'button'} variant={'outline'} asChild>  
                        <Link href="/credentials">  
                           Cancel
                        </Link>

                     </Button>

                  </div>
                    </form>

                

            </Form>
         </CardContent>

        </Card> 
        </>
    )
}
export const CredentialView =({id}:{id:string})=>{ 
  const {data:credential} = useSuspenseCredential(id)
  return <CredentialForm   intialdata={{
        id: credential.id,
        name: credential.name,
        type: credential.type,
        data: String(credential.data)}}/>
}           