"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/app/SessionProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Swal from "sweetalert2";

interface Applicant {
  id: number;
  jobseeker_id: number;
  job_id: number;
  jobseeker_status: string;
  jobseeker: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    jobseeker_profile: {
      avatar: string | null;
    } | null;
  };
}

const EmployerPostedEachJobCard = () => {
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
  const params = useParams();
  const session = useSession();
  const queryClient = useQueryClient();

  // Fetch job details
  const { data: jobDetails, isPending: isJobDetailsPending } = useQuery({
    queryKey: ["jobDetails", params.slug],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/${params.slug}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }).then((res) => res.json()),
    enabled: !!params.slug,
  });

  // Fetch applicants
  const { data: applicants, isPending: isApplicantsPending } = useQuery({
    queryKey: ["applicants", params.slug],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job-applicant/list/${params.slug}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }).then((res) => res.json()),
    enabled: !!params.slug,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, applicantId }: { status: string; applicantId: number }) => {
      if (!["shortlisted", "rejected"].includes(status)) {
        throw new Error("Invalid status");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job-applicant/status/${applicantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ jobseeker_status: status }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
    onError: (error: any) => {
      Toast.fire({
        icon: "error",
        title: error.message || "An error occurred",
      });
    },
  });

  if (isJobDetailsPending || isApplicantsPending) {
    return <div>Loading...</div>;
  }

  const applicantsData = applicants?.data || [];

  return (
    <div>
      {/* Job Details Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{jobDetails?.title}</h1>
        <div className="space-y-2">
          <p>
            <strong>Location:</strong> {jobDetails?.location}
          </p>
          <p>
            <strong>Type:</strong> {jobDetails?.job_type}
          </p>
          <p>
            <strong>Level:</strong> {jobDetails?.job_level}
          </p>
          <p>
            <strong>Salary Range:</strong> {jobDetails?.salary}
          </p>
          <p>
            <strong>Deadline:</strong> {jobDetails?.deadline}
          </p>
        </div>
      </div>

      {/* Applicants List Section */}
      <div className="h-[600px] pr-4">
        {applicantsData.map((applicant: Applicant) => (
          <div key={applicant.id} className="mb-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={applicant.jobseeker.jobseeker_profile?.avatar || undefined} alt={applicant.jobseeker.name} />
                  <AvatarFallback>{applicant.jobseeker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{applicant.jobseeker.name}</h3>
                  <p className="text-sm text-gray-500">{applicant.jobseeker.email}</p>
                  <p className="text-sm text-gray-500">{applicant.jobseeker.mobile}</p>
                  <Badge variant={applicant.jobseeker_status === "shortlisted" ? "secondary" : applicant.jobseeker_status === "rejected" ? "destructive" : "outline"}>{applicant.jobseeker_status}</Badge>
                </div>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() =>
                    updateStatusMutation.mutate({
                      status: "shortlisted",
                      applicantId: applicant.id,
                    })
                  }
                  size="sm"
                  variant="outline"
                  disabled={updateStatusMutation.isPending}
                >
                  Shortlist
                </Button>
                <Button
                  onClick={() =>
                    updateStatusMutation.mutate({
                      status: "rejected",
                      applicantId: applicant.id,
                    })
                  }
                  size="sm"
                  variant="destructive"
                  disabled={updateStatusMutation.isPending}
                >
                  Reject
                </Button>
              </div>
              {"sdsssdsdd"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerPostedEachJobCard;
