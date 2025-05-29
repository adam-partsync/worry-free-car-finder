import Header from "@/components/layout/Header";
import DealerChecker from "@/components/tools/DealerChecker";

export default function DealerCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dealer Risk Check
            </h1>
            <p className="text-xl text-gray-600">
              Verify dealer credentials, check reviews, and assess risk before you buy
            </p>
          </div>

          <DealerChecker />
        </div>
      </div>
    </div>
  );
}
