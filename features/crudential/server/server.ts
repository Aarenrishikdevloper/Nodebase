import { PAGINATION } from "@/config/constants";
import { db } from "@/lib/db";
import { credentials,  credentialTypeEnum } from "@/lib/db/schema";
import { decrypt, encrypt } from "@/lib/encryption";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { CredentialsType } from "@/type/type";
import { TRPCError } from "@trpc/server";

import { and, count, desc, eq, ilike } from "drizzle-orm";
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
    }),
    getMany:protectedProcedure.input(
        z.object({
            page:z.number().default(PAGINATION.DEFAULT_PAGE),  
            pageSize:z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),     
            search:z.string().default('')
            
        })
    ).query(async({ctx,input})=>{
        const{page,pageSize, search} =   input   
        const [items, totalCount] = await Promise.all([
            db.select().from(credentials).where(
                and(
                    eq(credentials.userId, ctx.auth.user.id), 
                      search  ? ilike(credentials.name, `%${search}%`) : undefined,    
                      
                )
            ).orderBy(desc(credentials.updatedAt) ).limit(pageSize).offset((page-1) * pageSize),         
                
                    db
                      .select({ count: count() })
                      .from(credentials)
                      .where(
                            and(
                            eq(credentials.userId, ctx.auth.user.id), 
                            search  ? ilike(credentials.name, `%${search}%`) : undefined,    
                      
                )
                      )
                      .then((rows) => Number(rows[0].count)),
            

        ])   
        const totalPages = Math.ceil(totalCount/ pageSize)   
        const hasNextPages = page < totalCount;  
        const haspreviousPage = page > 1  ;  
        return{
            items,  
            page, 
            pageSize,    
            totalCount, 
            totalPages,   
            hasNextPages,  
            haspreviousPage


        }
    }),
    remove:protectedProcedure.input(z.object({id:z.string()})).mutation(async({ctx,input})=>{
          const result = await db.delete(credentials).where(and(
            eq(credentials.id, input.id), 
            eq(credentials.userId, ctx.auth.user.id)
          )) 
          return result
    }),  
    getOne:protectedProcedure.input(z.object({id:z.string()})).query( async({ctx, input})=>{
        const credential = await db.select().from(credentials).where(
            and(
                eq(credentials.id,input.id), 
                eq(credentials.userId, ctx.auth.user.id)
            )
        ).limit(1)  
        if(credential.length ===0){
            throw new TRPCError(
                {
                    code:"NOT_FOUND", 
                    message:"Credentials not found"
                }
            )
        }  
        const result = credential[0]
        return {
            ...result, 
            data:decrypt(result.data as string)
        }
    }),  
    update:protectedProcedure.input(   
        z.object({
            id:z.string(),
            name:z.string().min(1, "Name is required"),  
            type:z.enum(credentialTypeEnum.enumValues), 
            value:z.string().min(1, "Value is required")
        })
        
    ).mutation(async({ctx,input})=>{
        const{id,name, type, value} = input   
        const updateCreddential = await db.transaction(async(tx)=>{
            const credential = await tx.select().from(credentials).where(
                and(
                    eq(credentials.id,id), 
                    eq(credentials.userId, ctx.auth.user.id)
                )
            ).limit(1)  
            if(credential.length === 0){
                throw new TRPCError({
                    code:"NOT_FOUND",   
                    message:"Credential not found"

                })
            } 
            const result = await tx.update(credentials).set({
                name:name,  
                type:type, 
                data:encrypt(value),
                updatedAt:new Date()
            }).where(
                and(
                    eq(credentials.id, id), 
                    eq(credentials.userId, ctx.auth.user.id)
                )
            ) 
            return{
                ...credential[0], 
                
            }
        }) 
        return updateCreddential
    }), 
    getByType:protectedProcedure.input(
        z.object({
            type:z.enum(CredentialsType)
        })
    ).query(async({input,ctx})=>{
        const{type} = input  
        const items = await db.select().from(credentials).where(
            and(
                eq(credentials.type, type), 
                eq(credentials.userId, ctx.auth.user.id)
            )
        ).orderBy(desc(credentials.updatedAt))   
        return  items
    })
})  