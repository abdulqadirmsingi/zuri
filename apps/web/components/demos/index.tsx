import type { ReactNode } from "react";
import { BottomNavDefault, BottomNavGlass } from "./bottom-nav-demos";
import {
  ButtonAlternatives,
  ButtonDefault,
  ButtonIcons,
  ButtonLoading,
  ButtonSizes,
  ButtonStates,
  ButtonVariants,
} from "./button-demos";
import { CopyButtonDefault, CopyButtonRecipes, CopyButtonStyles } from "./copy-button-demos";
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
import {
  ExpandingAsync,
  ExpandingDefault,
  ExpandingLooks,
  ExpandingSmall,
} from "./expanding-demos";
import { HeroFan, HeroMagazine, HeroSplit, HeroSplitStart } from "./hero-demos";
import {
  FieldDefault,
  FieldError,
  FieldTextarea,
  InputDefault,
  InputSizes,
  InputVariants,
  LabelDefault,
  LabelLooks,
  TextareaDefault,
  TextareaStates,
} from "./input-demos";
import { InputGroupButtons, InputGroupDefault, InputGroupLooks } from "./input-group-demos";
import { AlertDialogDefault, DropdownMenuChoices, DropdownMenuDefault } from "./menu-demos";
import { MarqueeDefault, MarqueeReverse, RevealDirections, RevealStagger } from "./motion-demos";
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
import { PhoneInputDefault, PhoneInputLayouts, PhoneInputLooks } from "./phone-input-demos";
import { PickerDefault, PickerInline, PickerSearch } from "./picker-demos";
import { BlurBoth, BlurBottom, BlurSide } from "./progressive-blur-demos";
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
import {
  CtaAccentDemo,
  CtaDemo,
  FooterDemo,
  HeaderDemo,
  HeadingDemo,
  PricingDemo,
  TestimonialsDemo,
} from "./shell-demos";
import { SwellNavDefault, SwellNavFour } from "./swell-nav-demos";
import {
  ThemeSegmented,
  ThemeSwitchLabelled,
  ThemeSwitchLooks,
  ThemeSwitchStyles,
} from "./theme-switch-demos";
import { UserMenuDefault, UserMenuWithName } from "./user-menu-demos";

const demos: Record<string, () => ReactNode> = {
  "button-default": ButtonDefault,
  "button-variants": ButtonVariants,
  "button-sizes": ButtonSizes,
  "button-states": ButtonStates,
  "button-icons": ButtonIcons,
  "button-loading": ButtonLoading,
  "button-alternatives": ButtonAlternatives,
  "picker-default": PickerDefault,
  "picker-search": PickerSearch,
  "picker-inline": PickerInline,
  "swell-nav-default": SwellNavDefault,
  "swell-nav-four": SwellNavFour,
  "bottom-nav-default": BottomNavDefault,
  "bottom-nav-glass": BottomNavGlass,
  "marquee-default": MarqueeDefault,
  "marquee-reverse": MarqueeReverse,
  "reveal-stagger": RevealStagger,
  "reveal-directions": RevealDirections,
  "shell-header": HeaderDemo,
  "shell-footer": FooterDemo,
  "shell-heading": HeadingDemo,
  "shell-cta": CtaDemo,
  "shell-cta-accent": CtaAccentDemo,
  "shell-pricing": PricingDemo,
  "shell-testimonials": TestimonialsDemo,
  "hero-split": HeroSplit,
  "hero-split-start": HeroSplitStart,
  "hero-magazine": HeroMagazine,
  "hero-fan": HeroFan,
  "blur-bottom": BlurBottom,
  "blur-both": BlurBoth,
  "blur-side": BlurSide,
  "theme-switch-styles": ThemeSwitchStyles,
  "theme-switch-labelled": ThemeSwitchLabelled,
  "theme-switch-looks": ThemeSwitchLooks,
  "theme-segmented": ThemeSegmented,
  "user-menu-default": UserMenuDefault,
  "user-menu-name": UserMenuWithName,
  "expanding-default": ExpandingDefault,
  "expanding-async": ExpandingAsync,
  "expanding-small": ExpandingSmall,
  "expanding-looks": ExpandingLooks,
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
  "copy-button-styles": CopyButtonStyles,
  "copy-button-recipes": CopyButtonRecipes,
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
  "label-looks": LabelLooks,
  "input-default": InputDefault,
  "input-variants": InputVariants,
  "input-sizes": InputSizes,
  "input-group-default": InputGroupDefault,
  "input-group-buttons": InputGroupButtons,
  "input-group-looks": InputGroupLooks,
  "phone-input-default": PhoneInputDefault,
  "phone-input-layouts": PhoneInputLayouts,
  "phone-input-looks": PhoneInputLooks,
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

/** Names that do not follow the `<name>-default` pattern. */
const demoAliases: Record<string, string> = {
  "password-strength": "password-default",
  "expanding-button-group": "expanding-default",
  "progressive-blur": "blur-bottom",
  avatar: "avatar-group",
  "theme-switch": "theme-switch-styles",
};

/** The name of a demo that shows the registry item `name`, if there is one. */
export function demoFor(name: string): string | undefined {
  if (Object.hasOwn(demoAliases, name)) return demoAliases[name];
  if (Object.hasOwn(demos, `${name}-default`)) return `${name}-default`;
  return Object.keys(demos).find((k) => k.startsWith(`${name}-`));
}
