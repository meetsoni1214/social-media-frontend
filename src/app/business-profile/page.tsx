"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import {
  businessProfileSchema,
  type BusinessProfileFormData,
} from "@/lib/validations";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { mockApi } from "@/lib/mockApi";
import { ProgressSteps } from "@/components/ProgressSteps";
import { GradientCard, GradientCardTitle } from "@/components/GradientCard";
import { GradientButton } from "@/components/GradientButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const BUSINESS_CATEGORIES = [
  "Restaurant & Food",
  "Retail & E-commerce",
  "Health & Wellness",
  "Education & Training",
  "Technology & Software",
  "Professional Services",
  "Real Estate",
  "Beauty & Fashion",
  "Arts & Entertainment",
  "Automotive",
  "Sports & Fitness",
  "Travel & Hospitality",
  "Home Services",
  "Non-Profit",
  "Other",
];

const STEPS = [
  {
    number: 1,
    title: "Business Profile",
    description: "Tell us about your business",
  },
  {
    number: 2,
    title: "Content Preferences",
    description: "Set your content style",
  },
];

export default function BusinessProfilePage() {
  const router = useRouter();
  const { updateBusinessProfile, businessProfile } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    businessProfile?.logo || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: businessProfile || {
      businessName: "",
      category: "",
      description: "",
      targetAudience: "",
      websiteUrl: "",
      logo: "",
      primaryColor: "#ff9a56",
      secondaryColor: "#ff6b9d",
      accentColor: "#c471ed",
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setValue("logo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    setIsLoading(true);
    try {
      await mockApi.saveBusinessProfile(data);
      updateBusinessProfile(data);
      router.push("/content-preferences");
    } catch (error) {
      console.error("Error saving business profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        <ProgressSteps currentStep={1} steps={STEPS} />

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
                  {...register("businessName")}
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
                <Select id="category" {...register("category")}>
                  <option value="">Select a category</option>
                  {BUSINESS_CATEGORIES.map((cat) => (
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
                  {...register("description")}
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
                  {...register("targetAudience")}
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
                  {...register("websiteUrl")}
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
                <div className="mt-2 mb-2 flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-white flex items-center justify-center">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-md hover:border-[var(--gradient-pink)] transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {logoPreview ? "Change Logo" : "Upload Logo"}
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
                          {...register("primaryColor")}
                          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={watch("primaryColor")}
                          onChange={(e) =>
                            setValue("primaryColor", e.target.value)
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
                          {...register("secondaryColor")}
                          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={watch("secondaryColor")}
                          onChange={(e) =>
                            setValue("secondaryColor", e.target.value)
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
                          {...register("accentColor")}
                          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                        />
                        <Input
                          value={watch("accentColor")}
                          onChange={(e) =>
                            setValue("accentColor", e.target.value)
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
            <GradientButton type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Saving..." : "Next Step"}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}
