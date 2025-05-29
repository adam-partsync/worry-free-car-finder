import Header from "@/components/layout/Header";
import BuyingExpectationEngine from "@/components/tools/BuyingExpectationEngine";

export default function PriceAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Market Price Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Get realistic buying expectations with comprehensive market analysis and negotiation insights
            </p>
          </div>

          <BuyingExpectationEngine />
        </div>
      </div>
    </div>
  );
}
