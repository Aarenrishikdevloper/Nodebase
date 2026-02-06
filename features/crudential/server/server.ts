import { db } from "@/lib/db";
import { credentials, credentialTypeEnum } from "@/lib/db/schema";
import { encrypt } from "@/lib/encryption";
import { createTRPCRouter, premiumProcedure } from "@/trpc/init";
import { CredentialsType } from "@/type/type";
import z from 'zod'
import { id } from "zod/v4/locales";

export const credentialsRoute  = createTRPCRouter({
    create:premiumProcedure.input(   
        z.object({
            name:z.string().min(1, "Name is required"),  
            type:z.enum(credentialTypeEnum.enumValues), 
            value:z.string().min(1, "Value is required")
        })
        
    ).mutation(async({ctx, input})=>{
        const {name, value, type} =  input  
        const [credential] = await  db.insert(credentials).values({
           name:name,  
           type:type,  
           data:encrypt(value),  
           userId:ctx.auth.user.id
        }).returning({
            id:credentials.id
        }) 
        return credential
    })
})