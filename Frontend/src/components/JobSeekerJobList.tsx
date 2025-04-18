import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Bookmark, MapPin, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { FadeIn } from "./ui/FadeIn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/app/SessionProvider";
import Swal from "sweetalert2";
import { FaBookmark } from "react-icons/fa";

export default function Component() {
  const session = useSession();
  const [isapplying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set()); // Track applied job IDs

  const queryClient = useQueryClient();
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());

  // ----------------------------------------------------------------------------------------
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
  // ----------------------------------------------------------------------------------------

  const applyJobMutation = useMutation({
    mutationFn: async (jobId) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/job-applicant/apply/${jobId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to apply job");
      }
      return data;
    },
    onSuccess: (data, jobId) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      setAppliedJobs((prev) => new Set(prev).add(jobId)); // Mark the job as applied

      queryClient.invalidateQueries({ queryKey: ["fetchJobseekerJobList"] });
    },
    onError: (data) => {
      Toast.fire({
        icon: "error",
        title: `${data.message}`,
      });
    },
  });

  const applyJob = (jobId: any) => {
    setApplying(true);

    try {
      applyJobMutation.mutate(jobId);
    } catch (error) {
      console.error("applyJob error:", error);
    } finally {
      setApplying(false);
    }
  };

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------

  const saveJobMutation = useMutation({
    mutationFn: async ({ jobId, isSaved }: { jobId: number; isSaved: boolean }) => {
      const endpoint = isSaved ? 'unsave-job' : 'save';
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/job-applicant/${endpoint}/${jobId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${endpoint} job`);
      }
      return { data, jobId, isSaved };
    },
    onSuccess: ({ data, jobId, isSaved }) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        if (isSaved) {
          newSet.delete(jobId);
        } else {
          newSet.add(jobId);
        }
        return newSet;
      });
    },
    onError: (data) => {
      Toast.fire({
        icon: "error",
        title: `${data.message}`,
      });
    },
  });

  const handleSaveToggle = (jobId: number) => {
    const isSaved = savedJobIds.has(jobId);
    saveJobMutation.mutate({ jobId, isSaved });
  };

  // ----------------------------------------------------------------------------------------
  const { isPending, error, data } = useQuery({
    queryKey: ["fetchJobseekerJobList"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/job/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`, // Pass Bearer token here
        },
      }).then((res) => res.json()),
  });

  console.log({ data });
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="mb-32 py-5">
      <section className="container p-0">
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((job: any) => (
            <FadeIn key={job.id}>
              <Card className="flex flex-col duration:100 transition ease-in opacity-70 hover:opacity-100 ">
                <CardHeader>
                  <div className=" flex justify-between">
                    <div className="w-12 h-12 flex flex-row  bg-gray-200 rounded-full mb-4"></div>
                    {/* <Button className="w-10 -p-6 bg-white hover:bg-slate-50"> */}
                    <FaBookmark onClick={() => handleSaveToggle(job.id)} className={`h-8 w-8 cursor-pointer ${savedJobIds.has(job.id) ? "text-yellow-500" : "text-gray-200"}`} />

                    {/* </Button> */}
                  </div>
                  <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                  <div className="justify-end w-fit  bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">{job.category}</div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="overflow-hidden text-gray-600 text-ellipsis line-clamp-3">{job.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <span className="text-sm text-gray-600">{job.salary}</span>
                </CardFooter>
                <CardFooter className="flex justify-between gap-4 pt-4">
                  <Button disabled={isapplying || appliedJobs.has(job.id)} onClick={() => applyJob(job.id)} className="w-full bg-orange-400 hover:bg-orange-500">
                    <span className="mr-2">
                      <Zap />
                    </span>
                    {appliedJobs.has(job.id) ? "Applied" : isapplying ? "Applying..." : "Quick Apply"}
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View details
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="top">
                      <SheetHeader>
                        <SheetTitle className="text-lg">Job Description</SheetTitle>
                        {/* <SheetDescription>{job.category}</SheetDescription> */}
                      </SheetHeader>
                      <div className="mt-4 ">
                        <h3 className="font-semibold  mt-4 mb-2"> Title</h3>
                        <p className="text-sm text-gray-600">{job.title}</p>
                        <h3 className="font-semibold  mt-4 mb-2"> Category</h3>
                        <p className="text-sm text-gray-600">{job.category}</p>
                        <h3 className="font-semibold  mt-4 mb-2"> Description</h3>
                        <p className="text-sm text-gray-600">{job.description}</p>
                        <h3 className="font-semibold mt-4 mb-2">Location</h3>
                        <p className="text-sm text-gray-600">{job.location}</p>
                        <h3 className="font-semibold mt-4 mb-2">Salary Range</h3>
                        <p className="text-sm text-gray-600">{job.salary}</p>
                      </div>
                      <div className="w-full flex justify-end">
                        <Button disabled={isapplying || appliedJobs.has(job.id)} onClick={() => applyJob(job.id)} className="w-full bg-orange-400 hover:bg-orange-500">
                          <span className="mr-2">
                            <Zap />
                          </span>
                          {appliedJobs.has(job.id) ? "Applied" : isapplying ? "Applying..." : "Quick Apply"}
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
