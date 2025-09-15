import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const FlowStep = ({
  title,
  description,
  highlighted = false,
}: {
  title: string;
  description: string;
  highlighted?: boolean;
}) => (
  <Card
    className={`flex flex-col items-center justify-center text-center p-4 min-h-[140px] w-full md:w-64 ${highlighted ? "bg-brand-dark text-white" : "bg-card"}`}
  >
    <p className="font-bold text-lg">{title}</p>
    <p
      className={`text-sm mt-1 ${highlighted ? "text-brand-pale" : "text-muted-foreground"}`}
    >
      {description}
    </p>
  </Card>
);

const CaseStudy = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-brand-dark text-center mb-2">
        A Consumer's Story: The Runaround
      </h2>
      <p className="text-center text-brand-medium mb-8 max-w-2xl mx-auto">
        A booking error, an immediate modification request, and a denied refund.
        This common scenario highlights a frustrating process for consumers.
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <FlowStep
          title="1. Booking"
          description="User books a hotel via trivago DEALS. Website allegedly alters dates without notice."
        />
        <ArrowRight className="h-8 w-8 text-brand-lighter hidden md:block" />
        <FlowStep
          title="2. Rectification Attempt"
          description="User immediately contacts support to correct the date error."
        />
        <ArrowRight className="h-8 w-8 text-brand-lighter hidden md:block" />
        <FlowStep
          title="3. Denial"
          description="Trivago refuses cancellation or refund, citing a strict 'non-refundable' policy."
          highlighted
        />
      </div>
    </section>
  );
};

export default CaseStudy;
