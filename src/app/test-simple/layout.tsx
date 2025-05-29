import SimpleHeader from '@/components/layout/SimpleHeader'

export default function TestSimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      {children}
    </div>
  )
}
