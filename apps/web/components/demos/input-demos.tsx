import { Field } from "@registry/inputs/field/field";
import { Input } from "@registry/inputs/input/input";
import { Label } from "@registry/inputs/label/label";
import { Textarea } from "@registry/inputs/textarea/textarea";

const stack = "flex w-full max-w-sm flex-col gap-4";

export function LabelDefault() {
  return (
    <div className={stack}>
      <Label htmlFor="demo-label">Phone number</Label>
      <Input id="demo-label" type="tel" autoComplete="tel" placeholder="+255 7XX XXX XXX" />
    </div>
  );
}

export function InputDefault() {
  return <Input aria-label="Full name" placeholder="Asha Juma" className="max-w-sm" />;
}

export function InputVariants() {
  return (
    <div className={stack}>
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Invalid" placeholder="Invalid" invalid />
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
      {/* Glass needs something behind it to blur. */}
      <span className="rounded-lg bg-linear-to-br from-accent to-primary p-4">
        <Input variant="glass" aria-label="Glass" placeholder="Glass" />
      </span>
    </div>
  );
}

export function InputSizes() {
  return (
    <div className={stack}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  );
}

export function TextareaDefault() {
  return <Textarea aria-label="Message" placeholder="Tell us more" className="max-w-sm" />;
}

export function TextareaStates() {
  return (
    <div className={stack}>
      <Textarea aria-label="Invalid" placeholder="Invalid" invalid />
      <Textarea aria-label="Disabled" placeholder="Disabled" disabled />
    </div>
  );
}

export function FieldDefault() {
  return (
    <Field label="Email" hint="We only use it for receipts." className="w-full max-w-sm">
      {(control) => <Input type="email" autoComplete="email" {...control} />}
    </Field>
  );
}

export function FieldError() {
  return (
    <Field
      label="Email"
      hint="We only use it for receipts."
      error="Enter an email like name@example.com."
      required
      className="w-full max-w-sm"
    >
      {(control) => <Input type="email" autoComplete="email" {...control} />}
    </Field>
  );
}

export function FieldTextarea() {
  return (
    <Field label="Message" hint="Up to 500 characters." className="w-full max-w-sm">
      {(control) => <Textarea {...control} />}
    </Field>
  );
}
