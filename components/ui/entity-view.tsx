import { title } from "process";
import { Button } from "./button";
import Link from "next/link";
import { Plus, PlusIcon } from "lucide-react";

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
