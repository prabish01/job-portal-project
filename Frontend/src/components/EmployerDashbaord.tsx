"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Briefcase, Users, Eye, CheckCircle2, CircleX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "@/app/SessionProvider";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type JobData = {
  data: any[];
  meta: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
};

export default function Component() {
  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, error, data, refetch } = useQuery<JobData>({
    queryKey: ["jobListData", currentPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/list?page=${currentPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }).then((res) => res.json()),
  });
  const {
    isPending: applicantPending,
    error: applicantError,
    data: applicantData,
    // refetch,
  } = useQuery<JobData>({
    queryKey: ["applicantData", currentPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}//employer/job-applicant/list/${currentPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }).then((res) => res.json()),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="container min-h-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.meta.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>

      <div className="gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">View All Applications</Button>
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between justify-items-center">
            <CardTitle>Recent Job Postings</CardTitle>
            <Link href="/employer/postjob">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 gap-4">
              {data?.data.map((job: any) => (
                <Link key={job.id} href={`/employer/dashboard/job/show/${job.id}`} passHref>
                  <div className="space-y-2 mt-5 hover:bg-gray-100 border rounded-lg p-4">
                    <div>
                      <div className="text-sm text-right text-muted-foreground">{job.created_at_ago_formatted}</div>
                    </div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {job.transaction_id ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                            <span className="text-green-500">Payment verified</span>
                          </>
                        ) : (
                          <>
                            <CircleX className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-red-500">Payment not verified</span>
                          </>
                        )}
                      </div>
                      <span>•</span>
                      <div>${job.salary || "Competitive"}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {job.type || "Full-time"} • {job.job_location || "Remote"} • Experience{""} {job.experience || "Not specified"}
                    </div>
                    <p className="text-sm flex-grow line-clamp-2">{job.job_description || "No description provided"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Pagination>
              <PaginationContent>
                {data?.meta.current_page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(data.meta.current_page - 1);
                      }}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: data?.meta.last_page || 0 }).map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, and 2 pages around current page
                  if (page === 1 || page === data?.meta.last_page || (page >= data?.meta.current_page - 1 && page <= data?.meta.current_page + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === data?.meta.current_page}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === data?.meta.current_page - 2 || page === data?.meta.current_page + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {data?.meta.current_page < (data?.meta.last_page || 0) && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(data.meta.current_page + 1);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
