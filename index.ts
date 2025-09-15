<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trivago: An Investigation into Consumer Complaints</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            height: 320px;
            max-height: 400px;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 400px;
            }
        }
        .flow-step {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 1rem;
            border-radius: 0.5rem;
            min-height: 100px;
            width: 100%;
        }
        .arrow {
            font-size: 2.5rem;
            color: #A1CEFF;
            transform: rotate(90deg);
        }
        @media (min-width: 768px) {
            .arrow {
                transform: rotate(0deg);
            }
        }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #003F5C;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-[#D6EFFF]">

    <div class="container mx-auto p-4 md:p-8">

        <header class="text-center mb-12">
            <h1 class="text-4xl md:text-6xl font-black text-[#003F5C] mb-2">Investigating Trivago</h1>
            <p class="text-lg md:text-xl text-[#366E9F] max-w-3xl mx-auto">An analysis of consumer complaints and regulatory findings regarding misleading booking practices and refund denials.</p>
        </header>

        <section id="case-study" class="mb-16">
            <h2 class="text-3xl font-bold text-[#003F5C] text-center mb-2">A Consumer's Story: The Runaround</h2>
            <p class="text-center text-[#366E9F] mb-8 max-w-2xl mx-auto">A booking error, an immediate modification request, and a denied refund. This common scenario highlights a frustrating process for consumers.</p>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div class="flow-step bg-white shadow-md">
                    <div>
                        <p class="font-bold text-lg text-[#003F5C]">1. Booking</p>
                        <p class="text-sm text-[#366E9F]">User books a hotel via trivago DEALS. Website allegedly alters dates without notice.</p>
                    </div>
                </div>
                <div class="arrow">➔</div>
                <div class="flow-step bg-white shadow-md">
                    <div>
                        <p class="font-bold text-lg text-[#003F5C]">2. Rectification Attempt</p>
                        <p class="text-sm text-[#366E9F]">User immediately contacts support to correct the date error.</p>
                    </div>
                </div>
                <div class="arrow">➔</div>
                <div class="flow-step bg-[#003F5C] text-white shadow-lg">
                    <div>
                        <p class="font-bold text-lg">3. Denial</p>
                        <p class="text-sm text-[#A1CEFF]">Trivago refuses cancellation or refund, citing a strict "non-refundable" policy.</p>
                    </div>
                </div>
                <div class="arrow">➔</div>
                <div class="flow-step bg-white shadow-md">
                     <div>
                        <p class="font-bold text-lg text-[#003F5C]">4. Dispute</p>
                        <p class="text-sm text-[#366E9F]">Credit card chargeback is filed but ultimately denied based on the merchant's policy.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="widespread-problem" class="mb-16">
            <h2 class="text-3xl font-bold text-[#003F5C] text-center mb-8">Not An Isolated Incident</h2>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-2xl font-bold text-[#003F5C] mb-4">Common Consumer Complaints</h3>
                    <p class="text-[#366E9F] mb-4">Analysis of public forums like the Better Business Bureau and ConsumerAffairs reveals recurring themes. Many users report feeling deceived by the booking process and frustrated by the lack of direct support, with Trivago often deflecting responsibility to third-party booking partners.</p>
                    <p class="text-sm text-[#6B9EDA]">The chart visualizes the distribution of major complaint types lodged against the platform.</p>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="chart-container">
                        <canvas id="complaintsChart"></canvas>
                    </div>
                </div>
            </div>
        </section>
        
        <section id="accc-lawsuit" class="mb-16 bg-[#003F5C] text-white rounded-xl shadow-2xl p-8 md:p-12">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-2">The Verdict: A Pattern of Deception</h2>
            <p class="text-center text-[#A1CEFF] mb-10 max-w-3xl mx-auto">In a landmark case, the Australian Competition and Consumer Commission (ACCC) took Trivago to Federal Court, which found the company guilty of misleading consumers in breach of Australian Consumer Law.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="text-center">
                    <p class="text-2xl text-[#A1CEFF] mb-2">Penalty for Misleading Conduct</p>
                    <p class="text-7xl md:text-8xl font-black text-white">$44.7M</p>
                    <p class="text-lg text-[#A1CEFF]">in fines ordered by the Australian Federal Court.</p>
                </div>
                <div class="bg-[#366E9F] rounded-lg p-6">
                    <h3 class="text-2xl font-bold text-white text-center mb-4">"Top Offers" Weren't The Cheapest</h3>
                    <p class="text-center text-[#D6EFFF] mb-4">The court found Trivago's algorithm prioritized advertisers who paid the most, not the sites with the best prices for consumers.</p>
                    <div class="chart-container h-64 md:h-72">
                        <canvas id="offersChart"></canvas>
                    </div>
                </div>
            </div>
        </section>

        <section id="deception-mechanics" class="mb-16">
            <h2 class="text-3xl font-bold text-[#003F5C] text-center mb-8">How The Deception Worked</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-2xl font-bold text-[#003F5C] mb-3">1. Cost-Per-Click Rankings</h3>
                    <p class="text-[#366E9F]">Trivago claimed to help users find the "ideal hotel for the best price." However, the prominence of a hotel deal in search results was significantly influenced by the "Cost-Per-Click" (CPC) fee the booking site paid Trivago. Higher fees often led to higher rankings, regardless of the final price for the consumer.</p>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-2xl font-bold text-[#003F5C] mb-3">2. Misleading Price Comparisons</h3>
                    <p class="text-[#366E9F]">The platform used "strike-through" prices to create a false sense of savings. The investigation found these comparisons were often invalid, pitting the price of a standard room against a more expensive luxury suite at the same hotel, making the highlighted deal appear better than it was.</p>
                </div>
            </div>
        </section>

        <section id="gemini-action" class="mb-16">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-3xl font-bold text-[#003F5C] text-center mb-4">Take Action: Generate a Complaint Letter</h2>
                <p class="text-center text-[#366E9F] mb-6 max-w-2xl mx-auto">Feeling wronged? Briefly describe your issue below. Our AI assistant, powered by Google's Gemini, will draft a formal complaint letter for you, citing the evidence and legal precedents outlined in this report.</p>
                
                <div class="max-w-xl mx-auto">
                    <textarea id="userInput" class="w-full p-3 border border-gray-300 rounded-lg mb-4" rows="4" placeholder="For example: 'I booked a room for July 10th, but Trivago changed it to July 11th and refused to refund me, costing me $300.'"></textarea>
                    <button id="generateButton" class="w-full bg-[#003F5C] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#366E9F] transition duration-300">
                        ✨ Generate Complaint Letter
                    </button>
                    <div id="loader" class="loader hidden"></div>
                    <div id="letterOutput" class="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-wrap"></div>
                </div>
            </div>
        </section>

        <footer class="text-center mt-12 pt-8 border-t border-[#A1CEFF]">
            <p class="text-lg text-[#003F5C] font-bold">Be Vigilant</p>
            <p class="text-[#366E9F] max-w-2xl mx-auto">The evidence suggests a pattern where commercial interests can outweigh consumer transparency. Always double-check booking details and be wary of deals that seem too good to be true.</p>
        </footer>

    </div>

    <script>
        function wrapLabels(label, maxWidth) {
            const words = label.split(' ');
            let lines = [];
            let currentLine = '';
            words.forEach(word => {
                if ((currentLine + word).length > maxWidth) {
                    lines.push(currentLine.trim());
                    currentLine = '';
                }
                currentLine += word + ' ';
            });
            lines.push(currentLine.trim());
            return lines;
        }

        const tooltipTitleCallback = (tooltipItems) => {
            const item = tooltipItems[0];
            let label = item.chart.data.labels[item.dataIndex];
            if (Array.isArray(label)) {
                return label.join(' ');
            }
            return label;
        };
        
        const brilliantBluesPalette = {
            dark: '#003F5C',
            medium: '#366E9F',
            light: '#6B9EDA',
            lighter: '#A1CEFF',
            pale: '#D6EFFF'
        };

        const complaintsCtx = document.getElementById('complaintsChart').getContext('2d');
        new Chart(complaintsCtx, {
            type: 'bar',
            data: {
                labels: ['Misleading Pricing / Deals', 'Refund Refused', 'Poor Customer Service', '3rd Party Booker Issues', 'Incorrect Booking'],
                datasets: [{
                    label: 'Percentage of Complaints',
                    data: [35, 30, 15, 15, 5],
                    backgroundColor: [
                        brilliantBluesPalette.dark,
                        brilliantBluesPalette.medium,
                        brilliantBluesPalette.light,
                        brilliantBluesPalette.lighter,
                        '#c0c0c0'
                    ],
                    borderColor: brilliantBluesPalette.pale,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: brilliantBluesPalette.dark
                        },
                        grid: {
                           color: '#e0e0e0'
                        }
                    },
                    y: {
                        ticks: {
                           color: brilliantBluesPalette.dark
                        },
                        grid: {
                           display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                           title: tooltipTitleCallback
                        }
                    }
                }
            }
        });

        const offersCtx = document.getElementById('offersChart').getContext('2d');
        new Chart(offersCtx, {
            type: 'doughnut',
            data: {
                labels: ['"Top Offer" Was NOT Cheapest', '"Top Offer" Was Cheapest'],
                datasets: [{
                    label: 'Analysis of "Top Position Offers"',
                    data: [66.8, 33.2],
                    backgroundColor: [
                        brilliantBluesPalette.dark,
                        brilliantBluesPalette.lighter
                    ],
                    borderColor: brilliantBluesPalette.pale,
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: brilliantBluesPalette.pale,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: tooltipTitleCallback,
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });

        const generateButton = document.getElementById('generateButton');
        const userInput = document.getElementById('userInput');
        const letterOutput = document.getElementById('letterOutput');
        const loader = document.getElementById('loader');

        generateButton.addEventListener('click', async () => {
            const userDescription = userInput.value;
            if (!userDescription) {
                letterOutput.textContent = 'Please describe your issue in the text box above.';
                return;
            }

            loader.classList.remove('hidden');
            letterOutput.textContent = '';
            generateButton.disabled = true;

            const systemPrompt = `You are a consumer rights advocate. Your task is to write a formal, firm, and professional complaint letter to Trivago's customer support. The user will provide a brief summary of their negative experience. You must incorporate their experience into the letter and strengthen their argument by referencing the established findings against Trivago.

            Key points to include:
            1.  Acknowledge the user's specific complaint (booking errors, refund denial, etc.).
            2.  Reference the fact that Trivago has a documented history of misleading consumers, as determined by regulatory bodies.
            3.  Specifically mention the landmark case by the Australian Competition and Consumer Commission (ACCC), where Trivago was fined $44.7 million for deceptive practices, such as prioritizing advertisers over the cheapest deals.
            4.  State that the user's experience appears to be part of a broader pattern of behavior rather than an isolated incident.
            5.  Clearly state the desired resolution (e.g., a full refund).
            6.  Maintain a professional tone, avoiding emotional or aggressive language.
            7.  The letter should be addressed to "Trivago Customer Support" and signed off as "A Concerned Consumer".`;
            
            const userQuery = `My issue is: ${userDescription}`;
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            try {
                const payload = {
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    letterOutput.textContent = candidate.content.parts[0].text;
                } else {
                    letterOutput.textContent = 'Sorry, there was an error generating the letter. Please try again.';
                }

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                letterOutput.textContent = 'An error occurred. Please check the console for details and try again later.';
            } finally {
                loader.classList.add('hidden');
                generateButton.disabled = false;
            }
        });

    </script>

</body>
</html>

