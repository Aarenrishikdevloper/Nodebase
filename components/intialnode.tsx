'use client';

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import {Workflownode} from "./workflow-node"
import { PlaceHolderNode } from "./React_Flow/Placeholder-node";
import { PlusIcon } from "lucide-react";
import { NodeSelector } from "./ui/NodeSelector";
export const Intialnode = memo((props:NodeProps)=>{   
  const [selectorOpen, setselectedOpen] = useState(false)

     return(      
       <NodeSelector open={selectorOpen} onOpenChange={setselectedOpen}>
        <Workflownode name="Intial Node" description="Click to add a node" showToolbar={false}>
            <PlaceHolderNode {...props} onClick={()=>setselectedOpen(true)}>
                      <div className=" cursor-pointer  flex items-center justify-center">
                        <PlusIcon className="size-4"/>
                      </div>
            </PlaceHolderNode>
        </Workflownode>  
        </NodeSelector>

     )
})  
Intialnode.displayName = "IntialNode"
