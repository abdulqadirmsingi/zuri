import type { ReactNode } from "react";
import { ButtonDefault, ButtonSizes, ButtonStates, ButtonVariants } from "./button-demos";
import {
  FieldDefault,
  FieldError,
  FieldTextarea,
  InputDefault,
  InputSizes,
  InputVariants,
  LabelDefault,
  TextareaDefault,
  TextareaStates,
} from "./input-demos";
import {
  CheckboxDefault,
  CheckboxStates,
  RadioGroupDefault,
  RadioGroupDisabled,
  RadioGroupHorizontalError,
  SelectDefault,
  SelectVariants,
  SwitchDefault,
  SwitchStates,
} from "./selection-demos";

const demos: Record<string, () => ReactNode> = {
  "button-default": ButtonDefault,
  "button-variants": ButtonVariants,
  "button-sizes": ButtonSizes,
  "button-states": ButtonStates,
  "checkbox-default": CheckboxDefault,
  "checkbox-states": CheckboxStates,
  "switch-default": SwitchDefault,
  "switch-states": SwitchStates,
  "radio-group-default": RadioGroupDefault,
  "radio-group-error": RadioGroupHorizontalError,
  "radio-group-disabled": RadioGroupDisabled,
  "select-default": SelectDefault,
  "select-variants": SelectVariants,
  "label-default": LabelDefault,
  "input-default": InputDefault,
  "input-variants": InputVariants,
  "input-sizes": InputSizes,
  "textarea-default": TextareaDefault,
  "textarea-states": TextareaStates,
  "field-default": FieldDefault,
  "field-error": FieldError,
  "field-textarea": FieldTextarea,
};

/** Looks a demo up by name, so MDX can say <Demo name="button-variants" />. */
export function Demo({ name }: { name: string }) {
  const render = Object.hasOwn(demos, name) ? demos[name] : undefined;
  if (!render) throw new Error(`Unknown demo: ${name}`);
  return <>{render()}</>;
}
