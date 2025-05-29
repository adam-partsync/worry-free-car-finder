"use client";

import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';

interface CarSearchButtonProps {
  carModel: string;
  priceRange?: string;
  year?: string;
}

export default function CarSearchButton({ carModel, priceRange, year }: CarSearchButtonProps) {
  const handleSearch = () => {
    // Build search query for external car sites
    const searchQuery = `${carModel} ${year || ''} ${priceRange || ''}`.trim();

    // Create search URLs for popular UK car sites
    const autotraderUrl = `https://www.autotrader.co.uk/car-search?keywords=${encodeURIComponent(searchQuery)}`;
    const carscoukUrl = `https://www.cars.co.uk/search?q=${encodeURIComponent(searchQuery)}`;
    const pistonheadsUrl = `https://www.pistonheads.com/classifieds/used-cars/search?q=${encodeURIComponent(searchQuery)}`;

    // Open multiple car search sites in new tabs
    window.open(autotraderUrl, '_blank');

    // Optionally open additional sites (commented out to avoid too many tabs)
    // setTimeout(() => window.open(carscoukUrl, '_blank'), 500);
    // setTimeout(() => window.open(pistonheadsUrl, '_blank'), 1000);
  };

  return (
    <Button
      onClick={handleSearch}
      size="sm"
      variant="outline"
      className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      <Search className="h-3 w-3 mr-2" />
      Find {carModel}
      <ExternalLink className="h-3 w-3 ml-2" />
    </Button>
  );
}
