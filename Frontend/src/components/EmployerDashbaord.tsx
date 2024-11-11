"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Briefcase, Users, Eye } from "lucide-react";
import { get } from "http";
import { useQuery } from "@tanstack/react-query";

interface EmployerDashboardProps {
  session: any;
  user: any;
}

type JobData = {
  data: any[];
  job: any;
};
export default function EmployerDashboard({ user }: EmployerDashboardProps) {
  //   const [jobData, setJobData] = useState<JobData | null>(null);

  const { isPending, error, data } = useQuery<JobData>({
    queryKey: ["jobListData"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Pass Bearer token here
        },
      }).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.name}</h1>
      {/* print job name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{JSON.stringify(data?.data.length)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{/* <div className="text-2xl font-bold">{jobPostings.reduce((sum, job) => sum + job.applicants, 0)}</div> */}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{/* <div className="text-2xl font-bold">{recentApplications.length}</div> */}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.data?.map((job: any) => (
                <li key={job.id} className="flex justify-between items-center">
                  <span className="hover:bg-gray-100 w-full rounded-lg p-2">{job.title}</span>
                  {/* <span className="text-sm text-muted-foreground">{job.applicants} applicants</span> */}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
        </Button>
        <Button variant="outline">View All Applications</Button>
      </div>
    </div>
  );
}
