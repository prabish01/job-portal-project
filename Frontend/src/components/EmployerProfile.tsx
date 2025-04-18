"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users, Globe, Linkedin, Building2, Mail, MapPin } from "lucide-react";
import { useSession } from "@/app/SessionProvider";

interface EmployerProfile {
  data: {
    id: number;
    employer_id: number;
    company_logo: string;
    company_logo_path: string;
    employee_count: number;
    website_url: string;
    linkedin_url: string;
    established_date: string;
    company_information: string;
    created_at: string;
    updated_at: string;
  };
}

function getFullImageUrl(path: string | undefined) {
  if (!path) return "/default-company-logo.png";
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}

export default function EmployerProfile() {
  const session = useSession();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<EmployerProfile>({
    queryKey: ["employer-profile"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer-profile/show`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Profile</h3>
          <p className="text-gray-600 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  const companyData = profile?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 bg-white rounded-2xl shadow-md p-4">
                <Image src={companyData?.company_logo_path || ""} alt="Company Logo" fill className="object-contain p-2" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Company Profile</h1>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">{companyData?.employee_count} Employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">Est. {new Date(companyData?.established_date || "").getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="px-8 py-10">
            {/* About Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                About Company
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">{companyData?.company_information}</p>
              </div>
            </div>

            {/* Contact & Social Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Connect With Us */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
                <div className="space-y-4">
                  {companyData?.website_url && (
                    <Link href={companyData.website_url} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group">
                      <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow group-hover:bg-primary/5 transition-all">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">Visit Website</span>
                    </Link>
                  )}
                  {companyData?.linkedin_url && (
                    <Link href={companyData.linkedin_url} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group">
                      <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow group-hover:bg-primary/5 transition-all">
                        <Linkedin className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">Follow on LinkedIn</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Established</p>
                      <p className="text-sm text-gray-600">
                        {new Date(companyData?.established_date || "").toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-8 py-4">
            <p className="text-sm text-gray-600">Last updated: {new Date(companyData?.updated_at || "").toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
