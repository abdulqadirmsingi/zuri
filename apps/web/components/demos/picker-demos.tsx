import { Label } from "@registry/inputs/label/label";
import { Picker, type PickerOption } from "@registry/inputs/picker/picker";

const plans: PickerOption[] = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
  { value: "business", label: "Business" },
  { value: "enterprise", label: "Enterprise", disabled: true },
];

const currencies: PickerOption[] = [
  {
    value: "TZS",
    label: "Tanzanian shilling",
    group: "East Africa",
    keywords: ["TZS", "Tanzania"],
  },
  { value: "KES", label: "Kenyan shilling", group: "East Africa", keywords: ["KES", "Kenya"] },
  { value: "UGX", label: "Ugandan shilling", group: "East Africa", keywords: ["UGX", "Uganda"] },
  { value: "RWF", label: "Rwandan franc", group: "East Africa", keywords: ["RWF", "Rwanda"] },
  { value: "ETB", label: "Ethiopian birr", group: "East Africa", keywords: ["ETB", "Ethiopia"] },
  { value: "ZAR", label: "South African rand", group: "Southern Africa", keywords: ["ZAR"] },
  { value: "ZMW", label: "Zambian kwacha", group: "Southern Africa", keywords: ["ZMW", "Zambia"] },
  { value: "USD", label: "US dollar", group: "World", keywords: ["USD", "dollar"] },
  { value: "EUR", label: "Euro", group: "World", keywords: ["EUR"] },
  { value: "GBP", label: "British pound", group: "World", keywords: ["GBP", "sterling"] },
];

export function PickerDefault() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="picker-plan">Plan</Label>
      <Picker id="picker-plan" options={plans} defaultValue="team" />
    </div>
  );
}

export function PickerSearch() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      <Label htmlFor="picker-currency">Currency</Label>
      <Picker
        id="picker-currency"
        options={currencies}
        placeholder="Choose a currency"
        searchLabel="Search currencies"
        emptyText="No currency matches"
      />
    </div>
  );
}

export function PickerInline() {
  return (
    <p className="m-0 text-3xl font-semibold tracking-tight">
      Pay in{" "}
      <Picker
        variant="inline"
        aria-label="Currency"
        options={currencies.slice(0, 5)}
        defaultValue="TZS"
        searchable={false}
      />
      .
    </p>
  );
}
