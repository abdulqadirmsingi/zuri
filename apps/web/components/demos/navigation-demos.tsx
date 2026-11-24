import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@registry/navigation/accordion/accordion";
import { Breadcrumbs } from "@registry/navigation/breadcrumbs/breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/navigation/tabs/tabs";

export function TabsDefault() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList aria-label="Account sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="limits">Limits</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Your balance and recent payments appear here.</TabsContent>
      <TabsContent value="activity">Every send, receive and refund, newest first.</TabsContent>
      <TabsContent value="limits">Daily and monthly limits for your account.</TabsContent>
    </Tabs>
  );
}

export function TabsLine() {
  return (
    <Tabs defaultValue="monthly" className="w-full max-w-md">
      <TabsList aria-label="Billing period" variant="line">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly">Billed every month. Cancel any time.</TabsContent>
      <TabsContent value="yearly">Billed once a year.</TabsContent>
    </Tabs>
  );
}

export function AccordionDefault() {
  return (
    <Accordion type="single" collapsible defaultValue="fees" className="w-full max-w-md">
      <AccordionItem value="fees">
        <AccordionTrigger>What are the fees?</AccordionTrigger>
        <AccordionContent>
          Sending to another Zuri wallet is free. Cash-out fees are shown before you confirm.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="limits">
        <AccordionTrigger>What are the limits?</AccordionTrigger>
        <AccordionContent>
          Limits depend on how much of your profile you have verified.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>How do I contact support?</AccordionTrigger>
        <AccordionContent>
          Use the help button in the app. We reply within one working day.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionMultiple() {
  return (
    <Accordion type="multiple" className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>Mobile money</AccordionTrigger>
        <AccordionContent>Pay with a provider you already use.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Cards</AccordionTrigger>
        <AccordionContent>Card details go straight to the payment provider.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function BreadcrumbsDefault() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#" },
        { label: "Payments", href: "#" },
        { label: "Receipt 4821" },
      ]}
    />
  );
}

export function BreadcrumbsLong() {
  return (
    <Breadcrumbs
      className="max-w-sm"
      items={[
        { label: "Home", href: "#" },
        { label: "Organisations", href: "#" },
        { label: "Rafiki Initiative Foundation", href: "#" },
        { label: "Scholarship programme", href: "#" },
        { label: "Application for the 2027 intake, stage three" },
      ]}
    />
  );
}
