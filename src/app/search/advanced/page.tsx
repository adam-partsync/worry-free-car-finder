import Header from "@/components/layout/Header";
import AdvancedSearchFilters from "@/components/search/AdvancedSearchFilters";

export default function AdvancedSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Car Search
            </h1>
            <p className="text-xl text-gray-600">
              Use detailed filters to find exactly what you're looking for
            </p>
          </div>

          <AdvancedSearchFilters />
        </div>
      </div>
    </div>
  );
}
