import { loaders } from "@/.registry/manifest";
import { requireAdminPage } from "@/lib/admin/session";
import { getDb } from "@/lib/analytics/db";
import { getOverview } from "@/lib/analytics/stats";
import { listKeys } from "@/lib/licence/keys";
import { KeysPanel } from "./keys-panel";
import { SignOut } from "./sign-out";
import { DataTable, StatTile } from "./tables";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminPage();
  const db = getDb();

  return (
    <main className="grid grid-cols-1 gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Zuri admin</h1>
        <SignOut />
      </header>
      {db ? <Dashboard db={db} /> : <NoDatabase />}
    </main>
  );
}

function NoDatabase() {
  return (
    <p className="zuri-glass rounded-lg p-4 text-sm">
      No database is configured, so there is nothing to show. Set{" "}
      <code className="font-mono">DATABASE_URL</code> in{" "}
      <code className="font-mono">apps/web/.env.local</code> and run{" "}
      <code className="font-mono">pnpm db:migrate</code>.
    </p>
  );
}

async function Dashboard({ db }: { db: NonNullable<ReturnType<typeof getDb>> }) {
  const known = Object.keys(loaders).filter((n) => n !== "index");
  const [o, keys] = await Promise.all([getOverview(db, known), listKeys(db)]);
  const t = o.totals;

  return (
    <>
      <section aria-label="Installs" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Today" value={t.today.unique} hint={`${t.today.raw} raw requests`} />
        <StatTile
          label="Last 7 days"
          value={t.last7d.unique}
          hint={`${t.last7d.raw} raw requests`}
        />
        <StatTile
          label="Last 30 days"
          value={t.last30d.unique}
          hint={`${t.last30d.raw} raw requests`}
        />
        <StatTile
          label="All time"
          value={t.allTime.unique}
          hint={`${t.allTime.raw} raw requests`}
        />
      </section>
      <p className="text-sm text-muted-foreground">
        Big numbers are de-duplicated installs: one per visitor per component per day. Raw requests
        are higher because the CLI fetches each item more than once. Bots and docs previews are
        excluded.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <DataTable
          caption="Top components (30 days)"
          headers={["Component", "Installs", "Raw"]}
          rows={o.topComponents.map((c) => [c.component, c.unique, c.raw])}
        />
        <DataTable
          caption="By country (30 days)"
          headers={["Country", "Installs"]}
          rows={o.byCountry.map((c) => [c.country, c.unique])}
        />
        <DataTable
          caption="By source (30 days, all requests)"
          headers={["Source", "Requests"]}
          rows={o.bySource.map((s) => [s.source, s.raw])}
        />
        <DataTable
          caption="By tier (30 days)"
          headers={["Tier", "Installs"]}
          rows={o.byTier.map((s) => [s.tier, s.unique])}
        />
      </div>

      <DataTable
        caption="Never installed"
        headers={["Component"]}
        rows={o.neverInstalled.map((c) => [c])}
        empty="Every component has been installed at least once."
      />

      <KeysPanel
        keys={keys.map((k) => ({
          id: k.id,
          keyPrefix: k.keyPrefix,
          customerRef: k.customerRef,
          status: k.status,
          createdAt: k.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
