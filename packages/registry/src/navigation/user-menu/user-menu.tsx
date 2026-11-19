"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type UserStatus = "available" | "busy" | "away";
export type ThemeChoice = "light" | "dark" | "system";

export interface UserMenuUser {
  name: string;
  email: string;
  /** A short plan or role label, e.g. "Pro". */
  plan?: string;
  /** Picture URL. Initials are shown when it is missing or fails to load. */
  avatarSrc?: string;
}

export interface UserMenuItem {
  id: string;
  label: string;
  /** Decorative icon (an inline SVG). Hidden from assistive technology. */
  icon?: ReactNode;
  /** A hint such as "Ctrl ,". It only shows the shortcut; it does not bind any keys. */
  shortcut?: string;
  /** Makes the item a link. Without it the item is a button. */
  href?: string;
  onSelect?: () => void;
}

export interface UserMenuMessages {
  /** The trigger's accessible name. */
  triggerLabel: (name: string, status?: string) => string;
  /** Name of the bottom sheet on narrow screens. */
  sheetClose: string;
  theme: string;
  themes: Record<ThemeChoice, string>;
  status: string;
  statuses: Record<UserStatus, string>;
  signOut: string;
  signingOut: string;
}

export const defaultUserMenuMessages: UserMenuMessages = {
  triggerLabel: (name, status) => `Account menu, ${name}${status ? `, ${status}` : ""}`,
  sheetClose: "Close",
  theme: "Theme",
  themes: { light: "Light", dark: "Dark", system: "System" },
  status: "Status",
  statuses: { available: "Available", busy: "Busy", away: "Away" },
  signOut: "Sign out",
  signingOut: "Signing out…",
};

export interface UserMenuProps {
  user: UserMenuUser;
  /** Account destinations. Keep it to three or four. */
  items?: UserMenuItem[];
  /** Presence status. Passing `status` or `onStatusChange` shows the status choice and the dot. */
  status?: UserStatus;
  defaultStatus?: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
  /** The theme choice. The menu only reports it; applying it to the page is up to your app. */
  theme?: ThemeChoice;
  defaultTheme?: ThemeChoice;
  onThemeChange?: (theme: ThemeChoice) => void;
  /** Shows the Light, Dark and System choice. Defaults to true. */
  showTheme?: boolean;
  /** Runs on Sign out. Return a promise to show a busy state until it settles. */
  onSignOut?: () => unknown;
  align?: "start" | "center" | "end";
  /** Shows the name beside the picture on screens 640px and wider. */
  showName?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  messages?: Partial<Omit<UserMenuMessages, "themes" | "statuses">> & {
    themes?: Partial<UserMenuMessages["themes"]>;
    statuses?: Partial<UserMenuMessages["statuses"]>;
  };
  /** Applied to the trigger button. */
  className?: string;
}

const narrowQuery = "(max-width: 639px)";
const subscribeNarrow = (notify: () => void) => {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(narrowQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const readNarrow = () =>
  typeof window.matchMedia === "function" && window.matchMedia(narrowQuery).matches;

/** True on narrow screens. False on the server and during hydration, so the first render matches. */
function useNarrow() {
  return useSyncExternalStore(subscribeNarrow, readNarrow, () => false);
}

const isPromise = (v: unknown): v is Promise<unknown> =>
  typeof (v as { then?: unknown } | null)?.then === "function";

/** A presence mark that differs by shape as well as colour: solid, barred or hollow. */
function PresenceDot({ status }: { status: UserStatus }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-0.5 -end-0.5 inline-flex size-3.5 items-center justify-center rounded-full ring-2 ring-background",
        status === "available" && "bg-success",
        status === "busy" && "bg-danger",
        status === "away" && "bg-background",
      )}
    >
      {status === "busy" ? <span className="h-0.5 w-2 rounded-full bg-background" /> : null}
      {status === "away" ? <span className="size-2 rounded-full border-2 border-warning" /> : null}
    </span>
  );
}

const spinner = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className="size-4 animate-spin motion-reduce:animate-pulse"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const signOutIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.5 2.5h-3v11h3M10 5l3 3-3 3M13 8H6.5" />
  </svg>
);

const chevron = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 text-muted-foreground"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const rowClass =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-start text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring [&_svg]:size-4 [&_svg]:shrink-0";

/**
 * The account menu behind a person's picture in an app's top bar: who they are, a few account
 * destinations, a theme choice, an optional status, and Sign out.
 *
 * On screens 640px and wider it is a menu (built on DropdownMenu, so arrow keys, typeahead,
 * Escape and focus return come from Radix). On narrower screens the same content opens as a
 * bottom sheet (built on Dialog), which is easier to reach with a thumb. Theme and status choices
 * keep the menu open; everything else closes it.
 */
export function UserMenu({
  user,
  items = [],
  status: statusProp,
  defaultStatus = "available",
  onStatusChange,
  theme: themeProp,
  defaultTheme = "system",
  onThemeChange,
  showTheme = true,
  onSignOut,
  align = "end",
  showName = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  messages: messagesProp,
  className,
}: UserMenuProps) {
  const messages: UserMenuMessages = {
    ...defaultUserMenuMessages,
    ...messagesProp,
    themes: { ...defaultUserMenuMessages.themes, ...messagesProp?.themes },
    statuses: { ...defaultUserMenuMessages.statuses, ...messagesProp?.statuses },
  };
  const narrow = useNarrow();
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerStatus, setInnerStatus] = useState(defaultStatus);
  const [innerTheme, setInnerTheme] = useState(defaultTheme);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const alive = useRef(true);
  const open = openProp ?? innerOpen;
  const showStatus = statusProp !== undefined || onStatusChange !== undefined;
  const status = statusProp ?? innerStatus;
  const theme = themeProp ?? innerTheme;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  function changeStatus(value: string) {
    const next = value as UserStatus;
    if (statusProp === undefined) setInnerStatus(next);
    onStatusChange?.(next);
  }
  function changeTheme(value: string) {
    const next = value as ThemeChoice;
    if (themeProp === undefined) setInnerTheme(next);
    onThemeChange?.(next);
  }

  async function signOut() {
    if (pending.current) return;
    const result = onSignOut?.();
    if (!isPromise(result)) return setOpen(false);
    // An async sign out keeps the menu open with its progress, then closes once it settles.
    pending.current = true;
    setBusy(true);
    try {
      await result;
    } catch {
      /* the app decides how to show a failure; the menu just stops waiting */
    } finally {
      pending.current = false;
      if (alive.current) {
        setBusy(false);
        setOpen(false);
      }
    }
  }

  const triggerName = messages.triggerLabel(
    user.name,
    showStatus ? messages.statuses[status] : undefined,
  );
  const trigger = (extra: Record<string, unknown>) => (
    <button
      ref={triggerRef}
      type="button"
      aria-label={triggerName}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full p-0.5 pe-0.5 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:data-[name]:pe-3",
        className,
      )}
      data-name={showName || undefined}
      {...extra}
    >
      <span className="relative inline-flex">
        <Avatar name={user.name} src={user.avatarSrc} size="md" />
        {showStatus ? <PresenceDot status={status} /> : null}
      </span>
      {showName ? (
        <>
          <span className="hidden max-w-32 truncate sm:inline">{user.name}</span>
          <span className="hidden sm:inline">{chevron}</span>
        </>
      ) : null}
    </button>
  );

  const identity = (
    <span className="flex min-w-0 items-center gap-3">
      {/* Decorative here: the name beside it says who this is, and a menu may not contain an image. */}
      <span aria-hidden="true" className="relative inline-flex shrink-0">
        <Avatar name={user.name} src={user.avatarSrc} size="md" />
        {showStatus ? <PresenceDot status={status} /> : null}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
          {user.plan ? (
            <span className="shrink-0 rounded-full border border-control-border px-2 text-xs font-medium text-foreground">
              {user.plan}
            </span>
          ) : null}
        </span>
        <span className="truncate text-xs font-normal text-muted-foreground" title={user.email}>
          {user.email}
        </span>
      </span>
    </span>
  );

  const themeIds = Object.keys(messages.themes) as ThemeChoice[];
  const statusIds = Object.keys(messages.statuses) as UserStatus[];

  if (narrow) {
    return (
      <>
        {trigger({
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          onClick: () => setOpen(!open),
        })}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            closeLabel={messages.sheetClose}
            // The sheet opens from a plain button (not a DialogTrigger), so Radix has no trigger to
            // return focus to; without this, focus would be lost to <body> when it closes.
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
            }}
            className="bottom-0 start-0 top-auto w-full max-w-none translate-x-0 translate-y-0 gap-3 rounded-b-none rounded-t-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))] starting:translate-y-full starting:scale-100 rtl:translate-x-0"
          >
            <div className="flex items-center gap-3 pe-8">
              <span aria-hidden="true" className="relative inline-flex shrink-0">
                <Avatar name={user.name} src={user.avatarSrc} size="md" />
                {showStatus ? <PresenceDot status={status} /> : null}
              </span>
              <div className="flex min-w-0 flex-col">
                <DialogTitle className="m-0">
                  <span className="text-base">{user.name}</span>
                </DialogTitle>
                <DialogDescription className="m-0 truncate">{user.email}</DialogDescription>
              </div>
            </div>
            <div className="-mx-2 flex flex-col">
              {items.map((item) => {
                const content = (
                  <>
                    {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
                    <span>{item.label}</span>
                  </>
                );
                return item.href ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      item.onSelect?.();
                      setOpen(false);
                    }}
                    className={rowClass}
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.onSelect?.();
                      setOpen(false);
                    }}
                    className={rowClass}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
            {[
              showTheme && {
                key: "theme",
                label: messages.theme,
                ids: themeIds as string[],
                names: messages.themes as Record<string, string>,
                value: theme as string,
                change: changeTheme,
              },
              showStatus && {
                key: "status",
                label: messages.status,
                ids: statusIds as string[],
                names: messages.statuses as Record<string, string>,
                value: status as string,
                change: changeStatus,
              },
            ].map((group) =>
              group ? (
                <fieldset key={group.key} className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
                  <legend className="mb-2 text-xs font-medium text-muted-foreground">
                    {group.label}
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {group.ids.map((id) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={group.value === id}
                        onClick={() => group.change(id)}
                        className="min-h-11 rounded-lg border border-control-border px-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                      >
                        {group.names[id]}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null,
            )}
            <button
              type="button"
              aria-busy={busy || undefined}
              onClick={() => void signOut()}
              className={cn(rowClass, "-mx-2 w-[calc(100%+1rem)] text-danger")}
            >
              {busy ? spinner : signOutIcon}
              <span>{busy ? messages.signingOut : messages.signOut}</span>
            </button>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger({})}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-72">
        <DropdownMenuLabel className="px-2.5 py-2.5">{identity}</DropdownMenuLabel>
        {items.length > 0 ? <DropdownMenuSeparator /> : null}
        {items.map((item) => {
          const inner = (
            <>
              {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
              <span>{item.label}</span>
              {item.shortcut ? (
                <DropdownMenuShortcut aria-hidden="true">{item.shortcut}</DropdownMenuShortcut>
              ) : null}
            </>
          );
          return item.href ? (
            <DropdownMenuItem key={item.id} asChild onSelect={() => item.onSelect?.()}>
              <a href={item.href}>{inner}</a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={item.id} onSelect={() => item.onSelect?.()}>
              {inner}
            </DropdownMenuItem>
          );
        })}
        {showTheme ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{messages.theme}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
              {themeIds.map((id) => (
                // Choosing a theme keeps the menu open so the change is visible.
                <DropdownMenuRadioItem key={id} value={id} onSelect={(e) => e.preventDefault()}>
                  {messages.themes[id]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        ) : null}
        {showStatus ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{messages.status}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={status} onValueChange={changeStatus}>
              {statusIds.map((id) => (
                <DropdownMenuRadioItem key={id} value={id} onSelect={(e) => e.preventDefault()}>
                  {messages.statuses[id]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          destructive
          aria-busy={busy || undefined}
          onSelect={(e) => {
            // Stay open while an async sign out runs, so its progress is visible.
            e.preventDefault();
            void signOut();
          }}
        >
          {busy ? spinner : signOutIcon}
          <span>{busy ? messages.signingOut : messages.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
