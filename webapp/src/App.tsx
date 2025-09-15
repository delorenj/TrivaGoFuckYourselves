import Header from './components/Header';
import CaseStudy from './components/CaseStudy';
import WidespreadProblem from './components/WidespreadProblem';
import AcccLawsuit from './components/AcccLawsuit';
import DeceptionMechanics from './components/DeceptionMechanics';
import ActionGenerator from './components/ActionGenerator';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-brand-pale min-h-screen font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <Header />
        <CaseStudy />
        <WidespreadProblem />
        <AcccLawsuit />
        <DeceptionMechanics />
        <ActionGenerator />
        <Footer />
      </main>
    </div>
  );
}

export default App;
