import { Checkbox } from "@registry/inputs/checkbox/checkbox";
import { Field } from "@registry/inputs/field/field";
import { Label } from "@registry/inputs/label/label";
import { Radio, RadioGroup } from "@registry/inputs/radio-group/radio-group";
import { Select } from "@registry/inputs/select/select";
import { Switch } from "@registry/inputs/switch/switch";

const row = "flex items-center gap-3";
const countries = (
  <>
    <option value="">Choose a country</option>
    <option value="tz">Tanzania</option>
    <option value="ke">Kenya</option>
    <option value="ug">Uganda</option>
  </>
);

export function CheckboxDefault() {
  return (
    <div className={row}>
      <Checkbox id="demo-terms" name="terms" />
      <Label htmlFor="demo-terms">I accept the terms</Label>
    </div>
  );
}

export function CheckboxStates() {
  return (
    <div className="flex flex-col gap-3">
      <div className={row}>
        <Checkbox id="cb-checked" defaultChecked />
        <Label htmlFor="cb-checked">Checked</Label>
      </div>
      <div className={row}>
        <Checkbox id="cb-invalid" invalid />
        <Label htmlFor="cb-invalid">Invalid</Label>
      </div>
      <div className={row}>
        <Checkbox id="cb-disabled" disabled />
        <Label htmlFor="cb-disabled">Disabled</Label>
      </div>
      <div className={row}>
        <Checkbox id="cb-disabled-on" disabled defaultChecked />
        <Label htmlFor="cb-disabled-on">Disabled and checked</Label>
      </div>
    </div>
  );
}

export function SwitchDefault() {
  return (
    <div className={row}>
      <Switch id="demo-notify" name="notify" />
      <Label htmlFor="demo-notify">Payment notifications</Label>
    </div>
  );
}

export function SwitchStates() {
  return (
    <div className="flex flex-col gap-3">
      <div className={row}>
        <Switch id="sw-on" defaultChecked />
        <Label htmlFor="sw-on">On</Label>
      </div>
      <div className={row}>
        <Switch id="sw-disabled" disabled />
        <Label htmlFor="sw-disabled">Disabled</Label>
      </div>
      <div className={row}>
        <Switch id="sw-disabled-on" disabled defaultChecked />
        <Label htmlFor="sw-disabled-on">Disabled and on</Label>
      </div>
    </div>
  );
}

export function RadioGroupDefault() {
  return (
    <RadioGroup legend="Payment method" hint="You can change this later.">
      <div className={row}>
        <Radio id="pm-mobile" name="pm" value="mobile" defaultChecked />
        <Label htmlFor="pm-mobile">Mobile money</Label>
      </div>
      <div className={row}>
        <Radio id="pm-card" name="pm" value="card" />
        <Label htmlFor="pm-card">Card</Label>
      </div>
      <div className={row}>
        <Radio id="pm-bank" name="pm" value="bank" />
        <Label htmlFor="pm-bank">Bank transfer</Label>
      </div>
    </RadioGroup>
  );
}

export function RadioGroupHorizontalError() {
  return (
    <RadioGroup legend="Delivery" orientation="horizontal" error="Choose a delivery option.">
      <div className={row}>
        <Radio id="dl-pickup" name="dl" value="pickup" />
        <Label htmlFor="dl-pickup">Pickup</Label>
      </div>
      <div className={row}>
        <Radio id="dl-courier" name="dl" value="courier" />
        <Label htmlFor="dl-courier">Courier</Label>
      </div>
    </RadioGroup>
  );
}

export function RadioGroupDisabled() {
  return (
    <RadioGroup legend="Plan" disabled>
      <div className={row}>
        <Radio id="pl-free" name="pl" value="free" defaultChecked />
        <Label htmlFor="pl-free">Free</Label>
      </div>
      <div className={row}>
        <Radio id="pl-pro" name="pl" value="pro" />
        <Label htmlFor="pl-pro">Pro</Label>
      </div>
    </RadioGroup>
  );
}

export function SelectDefault() {
  return (
    <Field label="Country" className="w-full max-w-sm">
      {(control) => (
        <Select name="country" autoComplete="country" {...control}>
          {countries}
        </Select>
      )}
    </Field>
  );
}

export function SelectVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Select aria-label="Invalid" invalid>
        {countries}
      </Select>
      <Select aria-label="Disabled" disabled>
        {countries}
      </Select>
      <Select aria-label="Small" size="sm">
        {countries}
      </Select>
      <Select aria-label="Large" size="lg">
        {countries}
      </Select>
      {/* Glass needs something behind it to blur. */}
      <span className="rounded-lg bg-linear-to-br from-accent to-primary p-4">
        <Select aria-label="Glass" variant="glass">
          {countries}
        </Select>
      </span>
    </div>
  );
}
