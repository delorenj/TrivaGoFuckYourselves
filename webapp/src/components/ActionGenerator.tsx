import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const ActionGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [letterOutput, setLetterOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!userInput) {
      setError('Please describe your issue in the text box above.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLetterOutput('');

    const systemPrompt = `You are a consumer rights advocate. Your task is to write a formal, firm, and professional complaint letter to Trivago's customer support. The user will provide a brief summary of their negative experience. You must incorporate their experience into the letter and strengthen their argument by referencing the established findings against Trivago.

Key points to include:
1.  Acknowledge the user's specific complaint (booking errors, refund denial, etc.).
2.  Reference the fact that Trivago has a documented history of misleading consumers, as determined by regulatory bodies.
3.  Specifically mention the landmark case by the Australian Competition and Consumer Commission (ACCC), where Trivago was fined $44.7 million for deceptive practices, such as prioritizing advertisers over the cheapest deals.
4.  State that the user's experience appears to be part of a broader pattern of behavior rather than an isolated incident.
5.  Clearly state the desired resolution (e.g., a full refund).
6.  Maintain a professional tone, avoiding emotional or aggressive language.
7.  The letter should be addressed to "Trivago Customer Support" and signed off as "A Concerned Consumer".`;

    const userQuery = `My issue is: ${userInput}`;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    
    if (!apiKey) {
        setError("API Key not found. Please create a .env file and add VITE_GEMINI_API_KEY=YOUR_KEY");
        setIsLoading(false);
        return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            setLetterOutput(candidate.content.parts[0].text);
        } else {
             setError('Sorry, the model returned an empty response. This might be due to safety settings blocking the request or response. Please try rephrasing your issue.');
        }

    } catch (err: any) {
        console.error('Error calling Gemini API:', err);
        setError(`An error occurred: ${err.message}. Please check the console and try again later.`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-dark text-center text-3xl">Take Action: Generate a Complaint Letter</CardTitle>
          <CardDescription className="text-center max-w-2xl mx-auto">
            Feeling wronged? Briefly describe your issue below. Our AI assistant, powered by Google's Gemini, will draft a formal complaint letter for you, citing the evidence and legal precedents outlined in this report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xl mx-auto">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="For example: 'I booked a room for July 10th, but Trivago changed it to July 11th and refused to refund me, costing me $300.'"
              className="mb-4"
              rows={4}
            />
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? 'Generating...' : '✨ Generate Complaint Letter'}
            </Button>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            {isLoading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark"></div>
              </div>
            )}
            {letterOutput && (
              <div className="mt-6 p-4 border rounded-lg bg-slate-50 whitespace-pre-wrap text-sm text-slate-700">
                {letterOutput}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ActionGenerator;
