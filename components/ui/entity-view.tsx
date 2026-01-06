import { title } from "process";
import { Button } from "./button";
import Link from "next/link";
import { Loader2Icon, MoreVerticalIcon, PackageOpenIcon, Plus, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./card";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./empty";
import { Input } from "./input";


//...Entry Heqader ....
type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);
export const EntityHeaders = ({
  title,
  description,
  onNew,
  newButtonLabel,
  newButtonHref,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-mutedtext-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {!newButtonHref && (
        <Button onClick={onNew} size={"sm"} disabled={isCreating || disabled}>
          <Plus className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Link href={newButtonHref} prefetch>
          <Button disabled={isCreating || disabled} size={"sm"}>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};
//....EntryContainer......
type EntryContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};
export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntryContainerProps) => {
  return (
    <div className="p-4 md:px-10 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};
interface EntityListProps<T>{
  items:T[],
  renderItem:(item:T,index:number)=>React.ReactNode,
  emptyView:React.ReactNode,
  getKey?: (item: T, index: number) => string | number;
  className?:string
}
export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className
}:EntityListProps<T>){  
  console.log(items)
  if(items.length === 0 && emptyView){
    return(
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">
           {emptyView}
        </div>

      </div>
    )
  }
  return(
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item,index)=>(
        <div key={getKey ?getKey(item, index):index}>
          {renderItem(item,index)}
        </div>
      ))}

    </div>
  )

}
interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  action?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?:string
}
export const EntityItem =({
  href,
  title,
  subtitle,
  image,
  action,
  onRemove,
  isRemoving,
 className

}:EntityItemProps)=>{  
  const handleRemove = async(e:React.MouseEvent)=>{
    e.preventDefault();  
    e.stopPropagation();  
    if(isRemoving){
      return
    }  
    if(onRemove){
      await onRemove()
    }
  }
  return(
    <Link href={href} prefetch>
      <Card className={
        cn(
           'p-4 shadow-none hover:shadow  cursor-pointer',
           isRemoving && "opacity-70 cursor-not-allowed",
           className

        )
      }>
        <CardContent className="flex flex-row  items-center justify-between p-2">
          <div className="flex items-center gap-3">
             {image}
            <div>
              <CardTitle className="text-base font-medium">{title }</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">{subtitle }</CardDescription>
              )}
            </div>
          </div>
         {(action || onRemove) && (
             <div className="flex gap-x-4 items-center">
              {action} 
              {onRemove  && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild> 
                    <Button size={'icon'} variant={'ghost'} onClick={(e)=>e.stopPropagation()}>     
                      <MoreVerticalIcon className="size-4"/>

                    </Button>

                  </DropdownMenuTrigger>  
                  <DropdownMenuContent align="end" onClick={(e)=>e.stopPropagation()}>
                     <DropdownMenuItem onClick={handleRemove}>
                        <TrashIcon className="size-4"/>  
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>

                </DropdownMenu>
              )}
             </div>  
         )}

        </CardContent>

      </Card>

    </Link>
  )
}
export const LoadingView =({message}:{message?:string})=>{
  return(
     <div className="flex justify-center items-center h-full flex-1  flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin  text-primary"/>   
      {Boolean(message) && (
        <p className="text-sm text-muted-foreground ">
          {message}
        </p>
      )}
     </div>
  )
}      
interface EmptyViewProps {
  onNew?:()=>void; 
  message?:string
}  
export const EmptyView =({onNew,message}:EmptyViewProps)=>{
   return(
     <Empty className="border border-dashed bg-white">    
       <EmptyHeader>
         <EmptyHeader>  
          <EmptyMedia variant={"icon"}>   
            <PackageOpenIcon/>

          </EmptyMedia> 
           
         </EmptyHeader> 
         <EmptyTitle>No Items</EmptyTitle>    
         {!!message && <EmptyDescription>{message}</EmptyDescription>}     
         {!!onNew &&(
           <EmptyContent>
             <Button onClick={onNew}>
               Add Item
             </Button>
           </EmptyContent>
         )}
       </EmptyHeader>
       
     </Empty>
   )
}  
interface EntitySearchProps {
  value:string; 
  onChange:(value:string)=>void;  
  placeholder?:string
}  
export const EntitySearch =({value,onChange,placeholder}:EntitySearchProps)=>{   
  return (
    <div className="relative ml-auto">
       <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2  text-muted-foreground"/>   
       <Input
          className={cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
         "max-w-[200px] bg-background shadow-none border-border pl-8")}
          placeholder={placeholder}   
          value={value}  
          onChange={(e)=>onChange(e.target.value)}
       />
    </div>
  )

}     
interface EntityPaginationProps{
  page:number;  
  totalpage:number;  
  onPageChange:(page:number)=>void; 
  disabled?:boolean
}
export const EntityPagination =({
   page,  
   totalpage, 
   onPageChange, 
   disabled
}:EntityPaginationProps)=>{
   return (
    <div className="flex items-center justify-between  gap-x-2 w-full">  
      <div className="flex-1 text-sm text-muted-foreground">
         Page {page} of {totalpage || 1}
      </div>    
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button disabled={page === 1 || disabled } variant={'outline'} size={'sm'} onClick={()=>onPageChange(Math.max(1, page-1))}>   
          Previous
        </Button>     
        <Button disabled={page === totalpage ||totalpage ===0 || disabled } variant={'outline'} size={'sm'} onClick={()=>onPageChange(Math.max(totalpage, page+1))}>   
          Next
        </Button>

      </div>

    </div>
   )
}