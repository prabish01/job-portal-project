"use client";

import BrowseSection from "@/components/CategorySection";
import JobLists from "@/components/JobLists";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SessionProvider, useSession } from "./SessionProvider";
import EmployerJobList from "@/components/JobSeekerJobList";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

interface SearchResult {
  id: number;
  title: string;
  company?: string;
  location?: string;
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const session = useSession();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-jobs?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search-jobs/?query=${encodeURIComponent(value.trim())}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //     Authorization: `Bearer ${session?.token}`,
        },
      });
      const data = await response.json();
      setSearchResults(data.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search Error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobClick = (jobTitle: string) => {
    setSearchQuery(jobTitle);
    setShowDropdown(false);
    router.push(`/search-jobs?query=${encodeURIComponent(jobTitle)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest(".search-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <SessionProvider>
      <section className="mt-32 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center container p-8 bg-white">
          <div>
            <div className="text-center md:text-left">
              <h1 className="text-7xl font-bold text-blue-600">We Help To Find Your Dream Job</h1>
              <p className="mt-4 text-lg text-gray-500">Our state-of-the-art service will help you land on your preferred job swift and hassle free</p>
            </div>
            <form onSubmit={handleSearch} className="flex mt-4 items-center space-x-4 relative">
              <div className="flex-grow relative">
                <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} onFocus={() => setShowDropdown(true)} placeholder="Job title or Keyword" className="ml-2 border-none outline-none focus:ring-0 w-full" />
                  {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />}
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && searchQuery.trim() && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((job: any) => (
                        <div key={job.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => handleJobClick(job.title)}>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.company}</div>
                          <div className="text-xs text-gray-400">{job.location}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No results found</div>
                    )}
                  </div>
                )}
              </div>
              <Button type="submit" className="px-6 py-2 text-white bg-blue-600 rounded-lg">
                Search
              </Button>
            </form>
          </div>
          <div className="hidden md:block">
            <Image src="/heroimage.png" width={600} height={600} alt="Hero" />
          </div>
        </div>
      </section>
      <section className="mt-32 mb-32 py-5">
        <BrowseSection />
      </section>
      <section className="mt-32 container mb-32 py-5">
        <div className="flex">
          <div>
            <h1 className="text-4xl  font-bold text-blue-500 mb-2">Explore popular jobs</h1>
            <p className="text-lg text-gray-500 mb-4">Checkout these jobs form popular companies. Start applying now</p>
          </div>
          <div className="ml-auto">
            <Button className="px-6 py-2 text-white bg-blue-600 rounded-lg">View All</Button>
          </div>
        </div>
        {session?.role === "jobseeker" ? (
          <>
            session xa
            <EmployerJobList />
          </>
        ) : (
          <>
            session xaina
            <JobLists />
          </>
        )}
      </section>
    </SessionProvider>
  );
}

function MapPinIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
