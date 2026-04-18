import { sendWorkFlowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {   
    try {
         console.log("Recieve google form webhook", );  
         const url =  new URL(request.url); 
         const WorkflowId = url.searchParams.get("workflowId")  
         if(!WorkflowId){
            return NextResponse.json(
                {sucess:false, error:"Missing required query parameter"},
                {status:400}
            )
         } 
         const body = await request.json(); 
         const formData ={
            formId:body.formId, 
            formTitle:body.formTitle, 
            responseId:body.responseId,  
            timestamp:body.timestamp,    
            responseEmail:body.respondentEmail,  
            responses:body.responses, 
            raw:body
         }    
         console.log(formData)
         const result = await sendWorkFlowExecution({
              workflowId:WorkflowId,
             intialData: { googleForm: formData },
            
         })   
         console.log(result)
         console.log("Sucessfully sent")  
         return NextResponse.json({
            successs:true, message:"Google form submittede processed sucessfully"
         },{status:200})
    } catch (error) {
         console.log(error)    
              return NextResponse.json({
            successs:true, message:"Failed to process Google form submission"
         },{status:500})
    
} 
}