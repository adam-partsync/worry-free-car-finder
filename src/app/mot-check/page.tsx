import Header from "@/components/layout/Header";
import MOTChecker from "@/components/tools/MOTChecker";

export default function MOTCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              MOT History Check
            </h1>
            <p className="text-xl text-gray-600">
              Check any vehicle's MOT history, mileage trends, and get early warnings about potential issues
            </p>
          </div>

          <MOTChecker />
        </div>
      </div>
    </div>
  );
}
