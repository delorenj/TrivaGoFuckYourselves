import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const offersData = [
    { name: '"Top Offer" Was NOT Cheapest', value: 66.8 },
    { name: '"Top Offer" Was Cheapest', value: 33.2 },
];
const COLORS = ['#003F5C', '#A1CEFF'];

const AcccLawsuit = () => {
  return (
    <section className="mb-16 bg-brand-dark text-white rounded-xl shadow-2xl p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">The Verdict: A Pattern of Deception</h2>
      <p className="text-center text-brand-lighter mb-10 max-w-3xl mx-auto">
        In a landmark case, the Australian Competition and Consumer Commission (ACCC) took Trivago to Federal Court, which found the company guilty of misleading consumers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center">
          <p className="text-2xl text-brand-lighter mb-2">Penalty for Misleading Conduct</p>
          <p className="text-7xl md:text-8xl font-black text-white">$44.7M</p>
          <p className="text-lg text-brand-lighter">in fines ordered by the Australian Federal Court.</p>
        </div>
        <Card className="bg-brand-medium border-brand-light">
          <CardHeader>
            <CardTitle className="text-white text-center">"Top Offers" Weren't The Cheapest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-brand-pale mb-4 text-sm">
                The court found Trivago's algorithm prioritized advertisers who paid the most, not the sites with the best prices for consumers.
            </p>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={offersData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                        >
                            {offersData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#003F5C', border: '1px solid #A1CEFF'}}/>
                        <Legend wrapperStyle={{color: "white"}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AcccLawsuit;
