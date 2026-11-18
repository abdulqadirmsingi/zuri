import { Button, buttonVariants } from "@registry/actions/button/button";
import { Field } from "@registry/inputs/field/field";
import { Input } from "@registry/inputs/input/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@registry/overlays/dialog/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@registry/overlays/popover/popover";
import { Tooltip } from "@registry/overlays/tooltip/tooltip";

export function DialogDefault() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>Edit profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change how your name appears on receipts.</DialogDescription>
        </DialogHeader>
        <Field label="Display name">
          {(control) => <Input defaultValue="Asha Juma" {...control} />}
        </Field>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>Cancel</DialogClose>
          <DialogClose className={buttonVariants()}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogGlass() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Open glass dialog
      </DialogTrigger>
      <DialogContent variant="glass">
        <DialogHeader>
          <DialogTitle>Glass dialog</DialogTitle>
          <DialogDescription>The panel blurs the page behind it.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={buttonVariants()}>Got it</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PopoverDefault() {
  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "outline" })}>Filters</PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <div className="flex flex-col gap-3">
          <Field label="Minimum amount (TZS)">
            {(control) => <Input inputMode="numeric" {...control} />}
          </Field>
          <Button size="sm">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TooltipDefault() {
  return (
    <>
      <Tooltip content="Add to favourites">
        <Button variant="outline" size="icon" aria-label="Favourite">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          >
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip content="Opens in a new tab" side="bottom">
        <Button variant="ghost">Documentation</Button>
      </Tooltip>
    </>
  );
}
