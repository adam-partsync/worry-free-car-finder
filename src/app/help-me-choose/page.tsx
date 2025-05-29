import Header from "@/components/layout/Header";
import HelpMeChooseForm from "@/components/forms/HelpMeChooseForm";

export default function HelpMeChoosePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Me Choose
            </h1>
            <p className="text-xl text-gray-600">
              Not sure what car you need? Our guided questionnaire will help you find the perfect match
            </p>
          </div>

          <HelpMeChooseForm />
        </div>
      </div>
    </div>
  );
}
