import React from "react";

const categoryInfo = [
  {
    title: "Information Technology (IT)",
    seats: 100,
  },
  {
    title: "Health Care",
    seats: 150,
  },
  {
    title: "Finance and Accounting",
    seats: 200,
  },
  {
    title: "Marketing and Sales",
    seats: 250,
  },
  {
    title: "Engineering",
    seats: 300,
  },
  {
    title: "Education and Training",
    seats: 350,
  },
  {
    title: "Human Resources",
    seats: 400,
  },
  {
    title: "Creative Arts and Design",
    seats: 450,
  },
];

const BrowseSection = () => {
  return (
    <div className="mt-32 mb-32 py-5">
      <section className="container mx-auto">
        <div className="text-center">
          <h1 className="text-4xl  font-bold text-blue-500 mb-2">Browse jobs by category</h1>
          <p className="text-lg text-gray-500 mb-4">Click here for more jobs.</p>
        </div>
      </section>
      <section className="container mx-auto">
        <div className="grid grid-cols-4 mt-10 items-center justify-center mx-auto justify-items-center p-2  gap-y-16">
          {categoryInfo.map((category, index) => (
            <div key={index} className="bg-blue-100 w-[15rem] h-[7rem] p-2 text-center transition-colors hover:bg-blue-500 rounded-md group flex flex-col justify-center">
              <h3 className="font-semibold text-lg group-hover:text-white transition-colors mb-2">{category.title}</h3>
              <h5 className="text-xs text-slate-400 transition-colors group-hover:text-slate-100">{category.seats}</h5>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrowseSection;
