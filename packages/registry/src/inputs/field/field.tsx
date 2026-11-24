import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

/** Props to spread onto the form control so it is labelled and described correctly. */
export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
}

export interface FieldProps extends Omit<ComponentProps<"div">, "children"> {
  /** Visible label text. */
  label: ReactNode;
  /** Helper text shown under the control. */
  hint?: ReactNode;
  /** Error message. Presence marks the control invalid and is announced to screen readers. */
  error?: ReactNode;
  required?: boolean;
  /** Receives the props to spread on your control, e.g. `{(p) => <Input {...p} />}`. */
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Label + control + hint + error, wired together with ids.
 * A render function (not cloneElement) keeps the wiring explicit and Server Component safe.
 */
export function Field({ label, hint, error, required, children, className, ...props }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="ms-0.5 text-danger">
            *
          </span>
        ) : null}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {/* role=alert so a newly appearing error is announced; the id keeps it linked too. */}
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
