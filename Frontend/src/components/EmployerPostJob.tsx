"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { jobCreateValidation } from "../../action/validation";
import * as z from "zod";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import getSession from "@/app/SessionProvider";

const fetchJobCategories = async (token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job-category/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "Error fetching job categories");
  }
  return data.data;
};
export default function JobCreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = getSession();

  type createJobForm = z.infer<typeof jobCreateValidation>;

  const form = useForm({
    resolver: zodResolver(jobCreateValidation),
    defaultValues: {
      job_category_id: "",
      title: "",
      job_description: "",
      number_of_openings: "",
      job_location: "",
      salary: "",
      job_level: "",
      education_requirement: "",
      experience: "",
      paid_amount: "",
    },
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["jobCategories"],
    queryFn: () => fetchJobCategories(session?.token || ""),
    enabled: !!session?.token,
  });
  console.log("Categories:", categories);

  // const [isPending, setPending] = useState(false);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createJobMutation = useMutation({
    mutationFn: async (formData: createJobForm) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/employer/job/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create job");
      }
      return data;
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      form.reset();

      console.log("Job created successfully", data);
    },
    onError: (data) => {
      Toast.fire({
        icon: "error",
        title: `${data.message}`,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (formData: createJobForm) => {
    setIsSubmitting(true);
    console.log("Form data:", formData);
    // console.log every form data types

    console.log("Job Category ID:", typeof formData.job_category_id);
    console.log("Title:", typeof formData.title);
    console.log("Job Description:", typeof formData.job_description);
    console.log("Number of Openings:", typeof formData.number_of_openings);
    console.log("Job Location:", typeof formData.job_location);
    console.log("Salary:", typeof formData.salary);
    console.log("Education Requirement:", typeof formData.education_requirement);
    console.log("Experience:", typeof formData.experience);

    try {
      console.log("Form data:", formData);

      await createJobMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-5xl mx-auto bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-800">Create New Job</CardTitle>
        </CardHeader>
        <form method="POST" onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="job_category_id" className="text-sm font-medium text-gray-700">
                  Job Category
                </Label>
                {isCategoriesLoading ? (
                  categoriesError ? (
                    <p className="text-red-500">Error fetching job categories</p>
                  ) : (
                    <p>Loading...</p>
                  )
                ) : (
                  <Controller
                    name="job_category_id"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category: any) => (
                            <SelectItem key={category.id.toString()} id={category.id.toString()} value={category.id.toString()}>
                              {" "}
                              {/* Convert ID to string */}
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.job_category_id && <p className="text-xs text-red-500">{errors.job_category_id.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Job Title
                </Label>
                <Input id="title" type="text" {...register("title")} className="w-full" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_description" className="text-sm font-medium text-gray-700">
                Job Description
              </Label>
              <Input type="text" id="job_description" {...register("job_description")} className="min-h-[100px]" />
              {errors.job_description && <p className="text-xs text-red-500">{errors.job_description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="number_of_openings" className="text-sm font-medium text-gray-700">
                  Number of Openings
                </Label>
                <Input id="number_of_openings" type="text" {...register("number_of_openings")} />
                {errors.number_of_openings && <p className="text-xs text-red-500">{errors.number_of_openings.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_location" className="text-sm font-medium text-gray-700">
                  Job Location
                </Label>
                <Input {...register("job_location")} type="text" id="job_location" />
                {errors.job_location && <p className="text-xs text-red-500">{errors.job_location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                  Salary
                </Label>
                <Input id="salary" type="text" {...register("salary")} />
                {errors.salary && <p className="text-xs text-red-500">{errors.salary.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="job_level" className="text-sm font-medium text-gray-700">
                  Job Level
                </Label>
                <Input id="job_level" type="text" {...register("job_level")} />
                {errors.job_level && <p className="text-xs text-red-500">{errors.job_level.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="education_requirement" className="text-sm font-medium text-gray-700">
                  Education Requirement
                </Label>
                <Input id="education_requirement" type="text" {...register("education_requirement")} />
                {errors.education_requirement && <p className="text-xs text-red-500">{errors.education_requirement.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                  Experience
                </Label>
                <Input id="experience" type="text" {...register("experience")} />
                {errors.experience && <p className="text-xs text-red-500">{errors.experience.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid_amount" className="text-sm font-medium text-gray-700">
                  Paid Amount
                </Label>
                <Input id="paid_amount" type="text" {...register("paid_amount")} />
                {errors.paid_amount && <p className="text-xs text-red-500">{errors.paid_amount.message}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 px-6 py-4">
            <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">
              {isSubmitting ? "Creating Job..." : "Create Job"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
