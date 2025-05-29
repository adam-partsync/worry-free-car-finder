import VehicleValuation from '@/components/tools/VehicleValuation'

export default function VehicleValuationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VehicleValuation />
    </div>
  )
}

export const metadata = {
  title: 'Vehicle Valuation Tool | Worry Free Car Finder',
  description: 'Get accurate vehicle valuations with depreciation forecasting and market analysis. Compare retail, private sale, and trade-in values.',
}
