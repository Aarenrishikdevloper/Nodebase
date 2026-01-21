'use client';

import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import {Workflownode} from "./workflow-node"
import { PlaceHolderNode } from "./React_Flow/Placeholder-node";
import { PlusIcon } from "lucide-react";
export const Intialnode = memo((props:NodeProps)=>{
     return( 
        <Workflownode name="Intial Node" description="Click to add a node" showToolbar={false}>
            <PlaceHolderNode {...props} onClick={()=>{}}>
                      <div className=" cursor-pointer  flex items-center justify-center">
                        <PlusIcon className="size-4"/>
                      </div>
            </PlaceHolderNode>
        </Workflownode>

     )
})  
Intialnode.displayName = "IntialNode"
