import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DeceptionMechanics = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-brand-dark text-center mb-8">How The Deception Worked</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-dark">1. Cost-Per-Click Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-medium">
              Trivago claimed to help users find the "ideal hotel for the best price." However, the prominence of a hotel deal was significantly influenced by the "Cost-Per-Click" (CPC) fee the booking site paid Trivago. Higher fees often led to higher rankings, regardless of the consumer's final price.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-dark">2. Misleading Price Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-medium">
              The platform used "strike-through" prices to create a false sense of savings. The investigation found these comparisons were often invalid, pitting the price of a standard room against a more expensive luxury suite at the same hotel, making the highlighted deal appear better than it was.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DeceptionMechanics;
