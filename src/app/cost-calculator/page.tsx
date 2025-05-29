import Header from "@/components/layout/Header";
import CostCalculator from "@/components/tools/CostCalculator";

export default function CostCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Running Cost Calculator
            </h1>
            <p className="text-xl text-gray-600">
              Get accurate estimates for 1-2 year running costs including fuel, insurance, tax, and maintenance
            </p>
          </div>

          <CostCalculator />
        </div>
      </div>
    </div>
  );
}
