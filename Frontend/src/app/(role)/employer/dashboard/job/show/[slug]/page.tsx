"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, GraduationCap, Clock, Users, CalendarIcon, CreditCard, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/app/SessionProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CheckoutBtn from "@/components/ui/CheckoutBtn";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ShowJob() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [khaltiResponseData, setKhaltiResponseData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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

  // Fetch job details
  const { data: jobData, isPending: isJobPending } = useQuery({
    queryKey: ["jobDetail", params.slug],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/show/${params.slug}`, {
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
    mutationFn: async ({ status, applicantId, startTime, endTime }: { status: string; applicantId: number; startTime?: string; endTime?: string }) => {
      if (!["shortlisted", "rejected"].includes(status)) {
        throw new Error("Invalid status");
      }

      // First, update the status
      const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job-applicant/status/${applicantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ jobseeker_status: status }),
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to update status");
      }

      // If status is shortlisted and we have meeting times, create the meeting
      if (status === "shortlisted" && startTime && endTime) {
        const meetingResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job-applicant/status/${applicantId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({
            jobseeker_status: status,
            start_time: startTime,
            end_time: endTime,
            meeting_link: "true", // This indicates we want to create a meeting
          }),
        });

        if (!meetingResponse.ok) {
          throw new Error("Failed to schedule meeting");
        }

        return meetingResponse.json();
      }

      return statusResponse.json();
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: data.message || "Successfully updated status and scheduled meeting",
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

  const hireApplicantMutation = useMutation({
    mutationFn: async (applicantId: number) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job-applicant/hire-applicant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ applicant_id: applicantId }),
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

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const khaltiResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/khalti/redirect/${params.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ job_id: params.slug }),
      });
      const khaltiResponseData = await khaltiResponse.json();
      setKhaltiResponseData(khaltiResponseData);
      setTimeout(() => {
        router.push(khaltiResponseData.payment_url);
        setIsSubmitting(true);
      }, 2000);
      return khaltiResponseData;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleShortlist = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setIsDialogOpen(true);
  };

  const handleCreateMeeting = () => {
    if (!startTime || !endTime) {
      Toast.fire({
        icon: "error",
        title: "Please select both start and end time",
      });
      return;
    }

    // Validate that end time is after start time
    if (new Date(endTime) <= new Date(startTime)) {
      Toast.fire({
        icon: "error",
        title: "End time must be after start time",
      });
      return;
    }

    // Validate that start time is in the future
    if (new Date(startTime) <= new Date()) {
      Toast.fire({
        icon: "error",
        title: "Start time must be in the future",
      });
      return;
    }

    updateStatusMutation.mutate({
      status: "shortlisted",
      applicantId: selectedApplicantId!,
      startTime,
      endTime,
    });

    setIsDialogOpen(false);
    setStartTime("");
    setEndTime("");
  };

  if (isJobPending || isApplicantsPending) return <div>Loading...</div>;

  const job = jobData?.data;
  const applicantsData = applicants?.data || [];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Job Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
          <Badge className={`px-2 py-1 rounded-full text-white ${job.transaction_id ? "bg-green-500" : "bg-red-500"}`}>{job.transaction_id ? "Paid" : "Unpaid"}</Badge>
        </CardHeader>
        <CardContent className="pt-6">
          <div>
            <div>
              <span>{job.job_description}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Briefcase size={20} />
                <span>{job.job_level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={20} />
                <span>{job.job_location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={20} />
                <span className="text-green-500">{job.salary}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={20} />
                <span>{job.experience}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center  space-x-2">
                <GraduationCap size={20} />
                <span>{job.education_requirement}</span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span className="text-red-400">{job.deadline}</span>
              </div> */}
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>{job.number_of_opening}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span className="text-red-400">{job.deadline}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      {job.transaction_id === null ? (
        <button onClick={onSubmit} className="w-full bg-purple-700" disabled={isSubmitting}>
          <CheckoutBtn >
        
        </CheckoutBtn>
          
          {" "}
        </button>
      ) : (
        // <button onClick={onSubmit} disabled={isSubmitting}>
        //   <div className="checkoutcontainer w-full">
        //     <div className="checkoutleft-side w-full bg-purple-600">
        //       <div className="checkoutcard">
        //         <div className="checkoutcard-line"></div>
        //         <div className="checkoutbuttons"></div>
        //       </div>
        //       <div className="checkoutpost">
        //         <div className="checkoutpost-line"></div>
        //         <div className="checkoutscreen">
        //           <div className="checkoutdollar">$</div>
        //         </div>
        //         <div className="checkoutnumbers"></div>
        //         <div className="checkoutnumbers-line2"></div>
        //       </div>
        //     </div>
        //     <div className="checkoutright-side ">
        //       <div className="checkoutnew text-purple-500 tracking-wider"> {isSubmitting ? "Processing..." : "Pay via Khalti"}</div>
        //     </div>
        //   </div>
        // </button>
        //
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Applicants</h2>
          <div className="space-y-4">
            {applicantsData.map((applicant: any) => (
              <div key={applicant.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={applicant.jobseeker.jobseeker_profile?.avatar || undefined} alt={applicant.jobseeker.name} />
                      <AvatarFallback>{applicant.jobseeker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{applicant.jobseeker.name}</h3>
                      <p className="text-sm text-gray-500">{applicant.jobseeker.email}</p>
                      <p className="text-sm text-gray-500">{applicant.jobseeker.mobile}</p>
                      <Badge variant={applicant.jobseeker_status === "shortlisted" ? "secondary" : applicant.jobseeker_status === "rejected" ? "destructive" : applicant.jobseeker_status === "hired" ? "default" : "outline"}>{applicant.jobseeker_status}</Badge>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => handleShortlist(applicant.id)} size="sm" variant="outline" disabled={updateStatusMutation.isPending || hireApplicantMutation.isPending}>
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
                      disabled={updateStatusMutation.isPending || hireApplicantMutation.isPending}
                    >
                      Reject
                    </Button>
                    {applicant.jobseeker_status === "shortlisted" && (
                      <Button onClick={() => hireApplicantMutation.mutate(applicant.id)} size="sm" variant="default" className="bg-green-500 hover:bg-green-600" disabled={updateStatusMutation.isPending || hireApplicantMutation.isPending}>
                        Hire
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="start-time">Start Time</label>
              <Input id="start-time" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-time">End Time</label>
              <Input id="end-time" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <Button onClick={handleCreateMeeting} disabled={updateStatusMutation.isPending} className="w-full">
              {updateStatusMutation.isPending ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
