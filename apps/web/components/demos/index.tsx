import type { ReactNode } from "react";
import { BottomNavDefault, BottomNavGlass } from "./bottom-nav-demos";
import {
  ButtonDefault,
  ButtonIcons,
  ButtonLoading,
  ButtonSizes,
  ButtonStates,
  ButtonVariants,
} from "./button-demos";
import { CopyButtonDefault } from "./copy-button-demos";
import {
  BadgeVariants,
  KbdDefault,
  ProgressDefault,
  SeparatorDefault,
  SkeletonCard,
  SpinnerSizes,
} from "./display-demos";
import {
  AvatarGroupDefault,
  AvatarSizes,
  CardDefault,
  CardVariants,
  EmptyStateDefault,
  StatDefault,
} from "./display-demos-2";
import { ExpandingAsync, ExpandingDefault, ExpandingSmall } from "./expanding-demos";
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
import { AlertDialogDefault, DropdownMenuChoices, DropdownMenuDefault } from "./menu-demos";
import {
  AccordionDefault,
  AccordionMultiple,
  BreadcrumbsDefault,
  BreadcrumbsLong,
  TabsDefault,
  TabsLine,
} from "./navigation-demos";
import { DialogDefault, DialogGlass, PopoverDefault, TooltipDefault } from "./overlay-demos";
import { PasswordDefault, PasswordReworded, PasswordWithError } from "./password-demos";
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
import { UserMenuDefault, UserMenuWithName } from "./user-menu-demos";

const demos: Record<string, () => ReactNode> = {
  "button-default": ButtonDefault,
  "button-variants": ButtonVariants,
  "button-sizes": ButtonSizes,
  "button-states": ButtonStates,
  "button-icons": ButtonIcons,
  "button-loading": ButtonLoading,
  "bottom-nav-default": BottomNavDefault,
  "bottom-nav-glass": BottomNavGlass,
  "user-menu-default": UserMenuDefault,
  "user-menu-name": UserMenuWithName,
  "expanding-default": ExpandingDefault,
  "expanding-async": ExpandingAsync,
  "expanding-small": ExpandingSmall,
  "password-default": PasswordDefault,
  "password-error": PasswordWithError,
  "password-reworded": PasswordReworded,
  "tabs-default": TabsDefault,
  "tabs-line": TabsLine,
  "accordion-default": AccordionDefault,
  "accordion-multiple": AccordionMultiple,
  "breadcrumbs-default": BreadcrumbsDefault,
  "breadcrumbs-long": BreadcrumbsLong,
  "alert-dialog-default": AlertDialogDefault,
  "dropdown-menu-default": DropdownMenuDefault,
  "dropdown-menu-choices": DropdownMenuChoices,
  "dialog-default": DialogDefault,
  "dialog-glass": DialogGlass,
  "popover-default": PopoverDefault,
  "tooltip-default": TooltipDefault,
  "copy-button-default": CopyButtonDefault,
  "checkbox-default": CheckboxDefault,
  "checkbox-states": CheckboxStates,
  "switch-default": SwitchDefault,
  "switch-states": SwitchStates,
  "radio-group-default": RadioGroupDefault,
  "radio-group-error": RadioGroupHorizontalError,
  "radio-group-disabled": RadioGroupDisabled,
  "select-default": SelectDefault,
  "select-variants": SelectVariants,
  "badge-variants": BadgeVariants,
  "separator-default": SeparatorDefault,
  "spinner-sizes": SpinnerSizes,
  "skeleton-card": SkeletonCard,
  "kbd-default": KbdDefault,
  "progress-default": ProgressDefault,
  "card-default": CardDefault,
  "card-variants": CardVariants,
  "avatar-sizes": AvatarSizes,
  "avatar-group": AvatarGroupDefault,
  "empty-state-default": EmptyStateDefault,
  "stat-default": StatDefault,
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
  const Component = Object.hasOwn(demos, name) ? demos[name] : undefined;
  if (!Component) throw new Error(`Unknown demo: ${name}`);
  // Rendered as a component (not called) so a demo may be a client component.
  return <Component />;
}
