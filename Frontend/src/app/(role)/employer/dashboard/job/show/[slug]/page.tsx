import EmployerPostedEachJobCard from "@/components/EmployerPostedEachJobCard";
import React from "react";

interface Props {
  params: {
    slug: string;
  };
}
const page = ({ params }: Props) => {
  const { slug } = params;
  return (
    <div className="min-h-screen gird place-content-center mx-auto">
      <div className="container w-2/4 p-16 ">
        <EmployerPostedEachJobCard
          params={{
            slug: slug,
          }}
        />
      </div>
    </div>
  );
};

export default page;
