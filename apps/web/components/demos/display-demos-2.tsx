import { Button } from "@registry/actions/button/button";
import { Avatar, AvatarGroup } from "@registry/display/avatar/avatar";
import { Badge } from "@registry/display/badge/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@registry/display/card/card";
import { EmptyState } from "@registry/display/empty-state/empty-state";
import { Stat } from "@registry/display/stat/stat";

const team = [
  "Asha Juma",
  "Baraka Mushi",
  "Neema Ali",
  "Juma Hassan",
  "Zawadi Omar",
  "Rehema Kileo",
].map((name) => ({ name }));

export function CardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Available to spend</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">TZS 240,000</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Top up</Button>
        <Badge variant="success">Verified</Badge>
      </CardFooter>
    </Card>
  );
}

export function CardVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Card variant="outline">
        <CardTitle as="h4">Outline</CardTitle>
      </Card>
      {/* Glass needs something behind it to blur. */}
      <div className="rounded-xl bg-linear-to-br from-accent to-primary p-4">
        <Card variant="glass">
          <CardTitle as="h4">Glass</CardTitle>
        </Card>
      </div>
    </div>
  );
}

export function AvatarSizes() {
  return (
    <>
      <Avatar name="Asha Juma" size="sm" />
      <Avatar name="Baraka Mushi" size="md" />
      <Avatar name="Neema Ali" size="lg" />
      <Avatar name="Single" />
    </>
  );
}

export function AvatarGroupDefault() {
  return <AvatarGroup people={team} max={4} />;
}

export function EmptyStateDefault() {
  return (
    <EmptyState
      className="w-full max-w-md"
      icon={
        <svg
          viewBox="0 0 24 24"
          className="size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <title>Empty tray</title>
          <path d="M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h5l1 2h6l1-2h5" strokeLinejoin="round" />
        </svg>
      }
      title="No transactions yet"
      description="Payments you send or receive will show up here."
      action={<Button size="sm">Request a payment</Button>}
    />
  );
}

export function StatDefault() {
  return (
    <div className="flex flex-wrap gap-10">
      <Stat
        label="Revenue"
        value="TZS 1,240,000"
        change="12%"
        trend="up"
        changeLabel="vs last month"
      />
      <Stat
        label="Failed payments"
        value="14"
        change="3%"
        trend="down"
        changeLabel="vs last month"
      />
      <Stat label="Active users" value="2,310" change="0%" />
    </div>
  );
}
