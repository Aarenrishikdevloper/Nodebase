import Handlebars from "handlebars";    
import { NodeExecutor } from "../../type/type";
import { httpRequestChannel } from "@/inngest/channel/httprequest";
import { NonRetriableError } from "inngest"; 
import ky, {type Options as KyOptions} from "ky"
Handlebars.registerHelper('json',(context)=>{
    const jsonString = JSON.stringify(context, null,2)   
    return new Handlebars.SafeString(jsonString)
})     
type HTTPRequestData ={
    variableName?:string  
    endpoint?:string;  
    method?:"GET" | "POST" | "PUT"  | "PATCH"  | "DELETE"      
    body?:string
}         
export const httpRequestExecutor:NodeExecutor<HTTPRequestData> = async({
    data,
    nodeId, 
    context,  
    step,  
    publish
})=>{
      
          await publish(
            httpRequestChannel().status({
                nodeId,  
                status:"loading"
            })    
          )            
          try {
              const  result = await step.run('http-request', async()=>{
                if(!data.endpoint){
                    await publish(
                        httpRequestChannel().status({nodeId, status:"error"})
                    )  
                    throw new NonRetriableError("HTTP Request node: No endpoint  configured")
                }  
                if(!data.variableName){
                    await publish(
                        httpRequestChannel().status({nodeId, status:"error"})
                    ) 
                       throw new NonRetriableError("HTTP Request node: variable name not configured")
                } 
                 if(!data.method){
                    await publish(
                        httpRequestChannel().status({nodeId, status:"error"})
                    )  
                    throw new NonRetriableError("HTTP Request node: method not   configured")
                }    
                const endpoint = Handlebars.compile(data.endpoint)(context)   
                const method = data.method    
                const option:KyOptions ={method}   
                if(['POST', 'PUT', 'PATCH'].includes(method)){
                    const resolver  = Handlebars.compile(data.body || '{}')(context)   
                    try {
                        JSON.parse(resolver)    
                    } catch (error) {
                         throw new NonRetriableError("HTTP Request node: Body must be valid json")
                    }   
                    option.body = resolver   
                    option.headers ={
                        'Content-Type':'application/json'
                    }
                }  
                const response = await ky(endpoint, option)    
                const contentType = response.headers.get('content-type')  
                const responseData = contentType?.includes('application/json') ?await response.json():await response.text()   
                const responsePayload ={
                    httpResponse:{
                        status:response.status, 
                        statusText:response.statusText, 
                        data:responseData
                    }
                }

                const variableName = data.variableName   
                return{
                    ...context,  
                    [variableName]:responsePayload
                }
              }) 
              await publish(
                httpRequestChannel().status({
                    nodeId, 
                    status:"success"
                })
              )
              return result
          } catch (error) {
                console.log(error)   
                 await publish(
                httpRequestChannel().status({
                    nodeId, 
                    status:"error"
                })
              )   
              throw error
 
          }
      
}