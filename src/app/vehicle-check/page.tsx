import Header from "@/components/layout/Header";
import VehicleHistoryChecker from "@/components/tools/VehicleHistoryChecker";

export default function VehicleCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vehicle History Check
            </h1>
            <p className="text-xl text-gray-600">
              Get a comprehensive background check for any vehicle - finance, accidents, theft, and more
            </p>
          </div>

          <VehicleHistoryChecker />
        </div>
      </div>
    </div>
  );
}
