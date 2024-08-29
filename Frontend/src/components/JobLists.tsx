import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { FadeIn } from "./ui/FadeIn";

const jobList = [
  {
    id: 1,
    title: "Job Title",
    category: "Job Category",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it is a long established fact that a reader will be distracted by the rea...",
    location: "Location",
    salary: "$20,000 - 60,000",
  },
  {
    id: 2,
    title: "Job Title",
    category: "Job Category",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it is a long established fact that a reader will be distracted by the rea...",
    location: "Location",
    salary: "$20,000 - 60,000",
  },
  {
    id: 3,
    title: "Job Title",
    category: "Job Category",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it is a long established fact that a reader will be distracted by the rea...",
    location: "Location",
    salary: "$20,000 - 60,000",
  },
  {
    id: 4,
    title: "Job Title",
    category: "Job Category",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it is a long established fact that a reader will be distracted by the rea...",
    location: "Location",
    salary: "$20,000 - 60,000",
  },
  {
    id: 5,
    title: "Job Title",
    category: "Job Category",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it is a long established fact that a reader will be distracted by the rea...",
    location: "Location",
    salary: "$20,000 - 60,000",
  },
  {
    id: 6,
    title: "Job Title",
    category: "Job Category",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it is a long established fact that a reader will be distracted by the rea...",
    location: "Location",
    salary: "$20,000 - 60,000",
  },
];

const JobLists = () => {
  return (
    <div className="mb-32 py-5">
      <section className="container p-0">
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobList.map((job) => (
            <>
              <FadeIn>
                <Card key={job.id} className="flex flex-col duration:100 transition ease-in opacity-70 hover:opacity-100 ">
                  <CardHeader>
                    <div className="w-12 h-12 flex flex-row  bg-gray-200 rounded-full mb-4"></div>
                    <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                    <div className="justify-end w-fit  bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">{job.category}</div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 text-sm">{job.description}</p>
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
            </>
          ))}
        </div>
      </section>
    </div>
  );
};

export default JobLists;
