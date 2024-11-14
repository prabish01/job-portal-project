"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, GraduationCap, Clock, Users, CalendarIcon, CreditCard } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/SessionProvider";
import { Button } from "./ui/button";
import Link from "next/link";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "zod";

interface JobDetailsProps {
  params: {
    slug: string;
  };
}

export default function Component({ params }: JobDetailsProps) {
  const router = useRouter();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [khaltiResponseData, setKhaltiResponseData] = useState(null); // State to store the response data

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

      setKhaltiResponseData(khaltiResponseData); // Save the response data

      console.log("KRD", khaltiResponseData);
      console.log("url", khaltiResponseData.payment_url);
      setTimeout(() => {
        router.push(khaltiResponseData.payment_url);
        setIsSubmitting(true);
      }, 2000);

      return khaltiResponseData;
    } catch (error) {
      console.error("Payment error:", error);
    }
    // finally {
    //   setIsSubmitting(false);
    // }
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["jobDetail"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/show/${params.slug}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }).then((res) => res.json()),
    enabled: !!params.slug,
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  const job = data?.data;

  if (!job) return <p>No job data available.</p>;

  return (
    <div>
      {/* <p>{khaltiResponseData}</p> */}

      <div className="space-y-10">
        <Card className="w-full     max-w-6xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
            <Badge variant={job.status ? "default" : "secondary"} className="text-sm px-2 py-1">
              {job.status || "Draft"}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">{job.job_location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">${job.salary.toLocaleString()} / year</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">{job.job_level}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">{job.education_requirement}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">{job.experience}</span>
              </div>
              {job.number_of_opening && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">{job.number_of_opening} openings</span>
                </div>
              )}
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground">{job.job_description}</p>
            </div>
            <div className="grid grid-cols-3 gap-6 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  Paid Amount
                </h3>
                <p className="text-sm text-muted-foreground">${job.paid_amount.toLocaleString()}</p>
              </div>
              {job.deadline && (
                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Application Deadline
                  </h3>
                  <p className="text-sm text-muted-foreground">{new Date(job.deadline).toLocaleDateString()}</p>
                </div>
              )}
              {job.transaction_id && (
                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    Transaction ID
                  </h3>
                  <p className="text-sm text-muted-foreground">{job.transaction_id}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {data?.data.transaction_id === null ? (
          <Button onClick={onSubmit} className="w-full bg-purple-700" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Pay via Khalti"}
          </Button>
        ) : (
          <>Payment vaisako</>
        )}
        <div className="container">
          <div className="left-side">
            <div className="card">
              <div className="card-line"></div>
              <div className="buttons"></div>
            </div>
            <div className="post">
              <div className="post-line"></div>
              <div className="screen">
                <div className="dollar">$</div>
              </div>
              <div className="numbers"></div>
              <div className="numbers-line2"></div>
            </div>
          </div>
          <div className="right-side">
            <div className="new">Checkout</div>
          </div>
        </div>
        {/* <Link href="">
          <Button type="submit" className="w-full bg-purple-700">
            Pay via Khalti
          </Button>
        </Link> */}
      </div>
    </div>
  );
}

// import { EmployerPostedEachJobCard } from "@/components/EmployerPostedEachJobCard";
// import React from "react";

// interface JobDetailsProps {
//   params: {
//     slug: string;
//   };
// }

// const page = ({ params }: JobDetailsProps) => {
//   const { slug } = params;

//   const session = useSession();
//   return <div>{slug}</div>;
// };

// export default page;
