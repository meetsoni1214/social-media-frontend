import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';

interface BusinessCardProps {
  profile: BusinessProfileResponse;
  onSelect: (businessId: BusinessProfileResponse['id']) => void;
}

export function BusinessCard({ profile, onSelect }: BusinessCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect(profile.id)}
      className="h-auto w-full justify-start rounded-xl p-0 text-left font-normal whitespace-normal hover:bg-transparent focus-visible:ring-2 focus-visible:ring-[var(--gradient-pink)] focus-visible:ring-offset-2"
    >
      <Card className="border-gray-200 p-4 transition hover:border-[var(--gradient-pink)] hover:shadow-md sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              {profile.businessName}
            </h2>
            <p className="text-xs text-gray-500">{profile.category}</p>
          </div>
          <Building2 className="h-5 w-5 text-gray-500" />
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">
          {profile.description}
        </p>
      </Card>
    </Button>
  );
}
