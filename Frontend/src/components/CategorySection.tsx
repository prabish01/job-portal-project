import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";

type CategoryData = {
  data: any[];
  category: any;
};

const BrowseSection = () => {
  // const JobLists = () => {
  const { isPending, error, data } = useQuery<CategoryData>({
    queryKey: ["jobListData"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job-category/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.token}`, // Pass Bearer token here
        },
      }).then((res) => res.json()),
  });

  // console.log({ data });
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-500 text-center">Job Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl text-gray-700 font-bold">{category.name}</CardTitle>
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm font-semibold">
                {category.job_count} jobs
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
// };

export default BrowseSection;
