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
import { useCreateCredential } from "../hooks/use-credential";
import { credentialTypeEnum } from "@/lib/db/schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
type CredentialType = (typeof credentialTypeEnum.enumValues)[number];

const credentialTypeMeta: Record<
  CredentialType,
  { label: string; logo: string }
> = {
  OPENAI: {
    label: "OpenAI",
    logo: "/openai.svg",
  },
  GEMINI: {
    label: "Gemini",
    logo: "/gemini.svg",
  },
  DEEPSEEK: {
    label: "DeepSeek",
    logo: "/deepseek.svg",
  },
  ANTHROPIC: {
    label: "Anthropic",
    logo: "/anthropic.svg", // optional / legacy
  },
};  
const VISIBLE_TYPES: CredentialType[] = [
  "OPENAI",
  "GEMINI",
  "DEEPSEEK",
];

export const credentialTypeOptions = VISIBLE_TYPES.map((type) => ({
  value: type,
  label: credentialTypeMeta[type].label,
  logo: credentialTypeMeta[type].logo,
}));
const formSchema =  z.object(({
    name:z.string().min(1, "name Is required"), 
    type:z.enum(CredentialsType),  
    value:z.string().min(1, "API Key Is reequired")
}))
    type FromValues = z.infer<typeof formSchema>  
    
export const CredentialForm =()=>{  
  const createCredential  = useCreateCredential()  
  const router = useRouter()
    const form = useForm<FromValues>({
        resolver:zodResolver(formSchema), 
        defaultValues:{
            name:"", 
            type:CredentialsType.OPENAI,  
            value:''
        }
    }) 
    const onSubmit =async(values:FromValues)=>{
        await  createCredential.mutateAsync(values,{
          onSuccess:(data)=>{

            router.push(`/credentials/${data.id}`)
          },onError:(error)=>{
             console.log(error);
          }
        })
    }
     
    return(
        <Card className="shadow-none">   
         <CardHeader>
            <CardTitle>
                Create Credentials
            </CardTitle> 
            <CardDescription>
                Add a new API Key or credential  to your account
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
                     <Button type={'submit'} >  
                        Create

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
    )
}
