import MaintenanceTracker from '@/components/tools/MaintenanceTracker'

export default function MaintenancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MaintenanceTracker />
    </div>
  )
}

export const metadata = {
  title: 'Maintenance Tracker | Worry Free Car Finder',
  description: 'Track your vehicle maintenance history, schedule services, and monitor costs with our comprehensive maintenance tracker.',
}
