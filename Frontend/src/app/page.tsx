import BrowseSection from "@/components/BrowseSection";
import JobLists from "@/components/JobLists";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

export default async function Home() {
  return (
    <SessionProvider>
      <section className="mt-32 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center container p-8 bg-white">
          <div>
            <div className="text-center md:text-left">
              <h1 className="text-7xl font-bold text-blue-600">We Help To Find Your Dream Job</h1>
              <p className="mt-4 text-lg text-gray-500">Our state-of-the-art service will help you land on your preferred job swift and hassle free</p>
            </div>
            <div className="flex mt-4 items-center space-x-4">
              <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
                <SearchIcon className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Job title or Keyword" className="ml-2 border-none outline-none focus:ring-0" />
              </div>
              <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Location" className="ml-2 border-none outline-none focus:ring-0" />
              </div>
              <Button className="px-6 py-2 text-white bg-blue-600 rounded-lg">Search</Button>
            </div>
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
        <JobLists />
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
