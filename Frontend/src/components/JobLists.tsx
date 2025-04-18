import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { FadeIn } from "./ui/FadeIn";
import { useQuery } from "@tanstack/react-query";

const JobLists = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["fetchJobList"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list-jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.token}`, // Pass Bearer token here
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
                  <div className="w-12 h-12 flex flex-row  bg-gray-200 rounded-full mb-4"></div>
                  <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                  <div className="justify-end w-fit  bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">{job.category}</div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="overflow-hidden text-gray-600 text-ellipsis line-clamp-3">
                    A Car Sales Manager oversees the sales team at a dealership, sets sales goals, and implements strategies to meet revenue targets. They recruit, train, and mentor staff, manage inventory, analyze sales data, and ensure excellent customer service. This role requires leadership
                    skills, industry knowledge, and the ability to drive team performance and profitability.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <span className="text-sm text-gray-600">{job.salary}</span>
                </CardFooter>
                <CardFooter className="flex justify-between gap-4 pt-4">
                  <Button className="w-full">Apply now</Button>
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
                        <Button className="w-44  mt-4">Apply now</Button>
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
};

export default JobLists;
