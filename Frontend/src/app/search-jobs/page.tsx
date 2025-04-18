"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary_from: string;
  salary_to: string;
  job_level: string;
  employment_type: string;
  description: string;
  created_at: string;
}

export default function SearchJobsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["search-jobs", query],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search-jobs/?query=${encodeURIComponent(query || "")}`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    },
    enabled: !!query,
  });

  const jobs = jobsData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Search Results for "{query}"</h1>
          <p className="mt-2 text-slate-600">Found {jobs.length} matching jobs</p>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link href={`/jobs/${job.id}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors">{job.title}</h2>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center text-slate-600">
                          <FiBriefcase className="h-5 w-5 text-slate-400 mr-2" />
                          {job.company}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <FiMapPin className="h-5 w-5 text-slate-400 mr-2" />
                          {job.location}
                        </div>
                        {(job.salary_from || job.salary_to) && (
                          <div className="flex items-center text-slate-600">
                            <FiDollarSign className="h-5 w-5 text-slate-400 mr-2" />
                            {job.salary_from && job.salary_to ? `${job.salary_from} - ${job.salary_to}` : job.salary_from || job.salary_to}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.job_level && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">{job.job_level}</span>}
                        {job.employment_type && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">{job.employment_type}</span>}
                      </div>

                      <div className="mt-4 text-slate-600 line-clamp-2">{job.description}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center text-slate-500">
                      <FiClock className="h-5 w-5 mr-2" />
                      <span className="text-sm">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">View Details →</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {jobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h2>
            <p className="text-slate-600">Try adjusting your search terms or browse all available jobs</p>
          </div>
        )}
      </div>
    </div>
  );
}
