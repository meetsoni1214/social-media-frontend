'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Sparkles } from 'lucide-react';
import Image from 'next/image';
import ColorThief from 'colorthief';
import {
  businessProfileSchema,
  type BusinessProfileFormData,
} from '@/lib/validations';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useSaveBusinessProfile } from '@/hooks/useBusinessProfile';
import { GradientCard, GradientCardTitle } from '@/components/GradientCard';
import { GradientButton } from '@/components/GradientButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const BUSINESS_CATEGORIES = [
  'Restaurant & Food',
  'Retail & E-commerce',
  'Health & Wellness',
  'Education & Training',
  'Technology & Software',
  'Professional Services',
  'Real Estate',
  'Beauty & Fashion',
  'Arts & Entertainment',
  'Automotive',
  'Sports & Fitness',
  'Travel & Hospitality',
  'Home Services',
  'Non-Profit',
  'Other',
];

export default function BusinessProfilePage() {
  const router = useRouter();
  const {
    updateBusinessProfile,
    businessProfile,
    isBusinessProfileComplete,
    isLoading: isProfileLoading,
  } = useOnboarding();
  const [error, setError] = useState('');
  const [isDetectingColors, setIsDetectingColors] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    businessProfile?.logo || null
  );
  const logoImageRef = useRef<HTMLImageElement>(null);

  const { mutate: saveBusinessProfile, isPending } = useSaveBusinessProfile();

  useEffect(() => {
    if (!isProfileLoading && isBusinessProfileComplete) {
      router.push('/dashboard');
    }
  }, [isBusinessProfileComplete, isProfileLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: businessProfile || {
      businessName: '',
      category: '',
      description: '',
      targetAudience: '',
      websiteUrl: '',
      logo: '',
      primaryColor: '#ff9a56',
      secondaryColor: '#ff6b9d',
      accentColor: '#c471ed',
    },
  });

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  };

  const detectColorsFromLogo = async () => {
    if (!logoImageRef.current) return;

    setIsDetectingColors(true);
    try {
      const colorThief = new ColorThief();
      const img = logoImageRef.current;

      if (img.complete) {
        const palette = colorThief.getPalette(img, 3) as [
          number,
          number,
          number,
        ][];

        if (palette && palette.length >= 3) {
          const [r1, g1, b1] = palette[0];
          const [r2, g2, b2] = palette[1];
          const [r3, g3, b3] = palette[2];

          setValue('primaryColor', rgbToHex(r1, g1, b1));
          setValue('secondaryColor', rgbToHex(r2, g2, b2));
          setValue('accentColor', rgbToHex(r3, g3, b3));
        }
      }
    } catch (error) {
      console.error('Error detecting colors:', error);
    } finally {
      setIsDetectingColors(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setValue('logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    setError('');

    saveBusinessProfile(data, {
      onSuccess: response => {
        updateBusinessProfile(data, response.id);
        router.push('/dashboard');
      },
      onError: (error: Error) => {
        setError(
          error.message || 'Failed to save business profile. Please try again.'
        );
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-[var(--gradient-pink)] animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)]" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Setup Your Business Profile
          </h1>
          <p className="text-gray-600">
            Help us understand your brand to create personalized content
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GradientCard>
            <GradientCardTitle className="text-center mb-2">
              Basic Information
            </GradientCardTitle>
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  {...register('businessName')}
                  placeholder="e.g., Acme Coffee Shop"
                />
                {errors.businessName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Industry/Category *</Label>
                <Select id="category" {...register('category')}>
                  <option value="">Select a category</option>
                  {BUSINESS_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe what your business does, what makes it unique..."
                  rows={4}
                  className="resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  {...register('targetAudience')}
                  placeholder="Who are your ideal customers? e.g., Young professionals aged 25-35..."
                  rows={3}
                  className="resize-none"
                />
                {errors.targetAudience && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.targetAudience.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  {...register('websiteUrl')}
                  placeholder="https://www.example.com"
                />
                {errors.websiteUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-2 mb-4 flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-white flex items-center justify-center">
                      <Image
                        ref={logoImageRef}
                        src={logoPreview}
                        alt="Logo preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-md hover:border-[var(--gradient-pink)] transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">
                          {logoPreview ? 'Change Logo' : 'Upload Logo'}
                        </span>
                      </div>
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {logoPreview && (
                      <Button
                        type="button"
                        onClick={detectColorsFromLogo}
                        disabled={isDetectingColors}
                        variant="outline"
                        size="default"
                        className="border-purple-300 bg-purple-50 hover:bg-purple-100"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700">
                          {isDetectingColors
                            ? 'Detecting...'
                            : 'Detect Colors from Logo'}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor" className="text-sm">
                        Primary Color
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          id="primaryColor"
                          type="color"
                          {...register('primaryColor')}
                          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={watch('primaryColor')}
                          onChange={e =>
                            setValue('primaryColor', e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor" className="text-sm">
                        Secondary Color
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          id="secondaryColor"
                          type="color"
                          {...register('secondaryColor')}
                          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={watch('secondaryColor')}
                          onChange={e =>
                            setValue('secondaryColor', e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accentColor" className="text-sm">
                        Accent Color
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          id="accentColor"
                          type="color"
                          {...register('accentColor')}
                          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={watch('accentColor')}
                          onChange={e =>
                            setValue('accentColor', e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GradientCard>

          <div className="flex justify-end">
            <GradientButton type="submit" size="lg" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save and Continue'}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}
