"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/SessionProvider";
import { Building2, Users, Globe, Linkedin, Calendar, FileText, Upload } from "lucide-react";
import Swal from "sweetalert2";

// Toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default function EmployerCreateProfile() {
  const router = useRouter();
  const session = useSession();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_logo: null as File | null,
    employee_count: "",
    website_url: "",
    linkedin_url: "",
    established_date: "",
    company_information: "",
  });

  const createProfile = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer-profile/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      return response.json();
    },
    onSuccess: () => {
      Toast.fire({
        icon: "success",
        title: "Profile created successfully",
      });
      router.push("/employer/dashboard");
    },
    onError: (error) => {
      Toast.fire({
        icon: "error",
        title: "Failed to create profile",
        timer: 2000,
      });
      console.error("Profile creation error:", error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, company_logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.company_logo) {
      Toast.fire({
        icon: "warning",
        title: "Please upload a company logo",
      });
      return;
    }

    if (!formData.employee_count || !formData.established_date || !formData.company_information) {
      Toast.fire({
        icon: "warning",
        title: "Please fill in all required fields",
      });
      return;
    }

    // Show loading toast
    Toast.fire({
      icon: "info",
      title: "Creating your profile...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    createProfile.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Company Profile</h1>
            <p className="mt-2 text-gray-600">Complete your company profile to start hiring talent.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">Company Logo</label>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewLogo ? (
                    <img src={previewLogo} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">Upload Logo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Recommended: Square image</p>
                  <p>Maximum size: 2MB</p>
                  <p>Formats: PNG, JPG</p>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Employee Count</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.employee_count}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employee_count: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Number of employees"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Established Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.established_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, established_date: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.website_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website_url: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Information</label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  required
                  value={formData.company_information}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company_information: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px]"
                  placeholder="Tell us about your company..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit" disabled={createProfile.isPending} className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                {createProfile.isPending ? "Creating Profile..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
