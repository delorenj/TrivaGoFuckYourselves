import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const complaintData = [
  { name: 'Misleading Pricing', value: 35 },
  { name: 'Refund Refused', value: 30 },
  { name: 'Poor Customer Service', value: 15 },
  { name: '3rd Party Issues', value: 15 },
  { name: 'Incorrect Booking', value: 5 },
];

const COLORS = ['#003F5C', '#366E9F', '#6B9EDA', '#A1CEFF', '#c0c0c0'];

const WidespreadProblem = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-brand-dark text-center mb-8">Not An Isolated Incident</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-dark">Common Consumer Complaints</CardTitle>
            <CardDescription>Analysis of public forums like the BBB and ConsumerAffairs reveals recurring themes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-brand-medium">
              Many users report feeling deceived by the booking process and frustrated by the lack of direct support, with Trivago often deflecting responsibility to third-party booking partners. The chart visualizes the distribution of major complaint types.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={complaintData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="#366E9F" />
                  <YAxis type="category" dataKey="name" width={120} stroke="#366E9F" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{fill: '#D6EFFF'}} contentStyle={{backgroundColor: 'white', border: '1px solid #ccc'}} />
                  <Bar dataKey="value" barSize={20}>
                    {complaintData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WidespreadProblem;
