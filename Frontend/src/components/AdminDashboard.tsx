"use client";

import * as React from "react";
import { Book, FileText, GraduationCap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/app/SessionProvider";
import { useFetchCategory, useFetchEmployerJob } from "@/app/(role)/admin/api/fetchCategroy";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { MdDone } from "react-icons/md";
import Swal from "sweetalert2";

type ContentType = "Category" | "Jobs" | "Scholarships";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof schema>;

export default function Component() {
  const [activeContent, setActiveContent] = React.useState<ContentType>("Category");
  const [isAddPending, setIsAddPending] = React.useState(false);
  const session = useSession();
  const queryClient = useQueryClient();
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
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { isPending: categoryPending, error: categoryError, data: categoryData } = useFetchCategory(session?.token);
  const { isPending: employerJobListPending, error: employerJobListError, data: employerJobListData } = useFetchEmployerJob(session?.token);

  const addItem = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job-category/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create item");
      }
      return response.json();
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["categoryListData"] });
      reset();
    },
    onError: (error) => {
      Toast.fire({
        icon: "error",
        title: `${error.message}`,
      });
    },
    onSettled: () => {
      setIsAddPending(false);
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job-category/destroy/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      return response.json();
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["categoryListData"] });
    },
    onError: (error) => {
      Toast.fire({
        icon: "error",
        title: `${error.message}`,
      });
    },
  });
  const approveJob = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job/change-status/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ status: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to approve job");
      }
      return response.json();
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["categoryListData"] });
    },
    onError: (error) => {
      Toast.fire({
        icon: "error",
        title: `${error.message}`,
      });
    },
  });

  const onSubmit = async (formData: FormData) => {
    setIsAddPending(true);
    try {
      await addItem.mutateAsync(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (itemId: string) => {
    deleteItem.mutate(itemId);
  };
  const handleApprove = (itemId: string) => {
    approveJob.mutate(itemId);
  };

  if (categoryError) {
    return (
      <div className="min-h-screen container mx-auto">
        <h1>{categoryError.message}</h1>
      </div>
    );
  }

  if (categoryPending) {
    return (
      <div className="min-h-screen container mx-auto">
        <div className="container mt-[30rem]">
          <h1 className="text-center text-lg">Loading...</h1>
        </div>
      </div>
    );
  }
  if (employerJobListError) {
    return (
      <div className="min-h-screen container mx-auto">
        <h1>{employerJobListData.message}</h1>
      </div>
    );
  }

  if (employerJobListPending) {
    return (
      <div className="min-h-screen container mx-auto">
        <div className="container mt-[30rem]">
          <h1 className="text-center text-lg">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <Sidebar collapsible="none">
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Content</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveContent("Category")} isActive={activeContent === "Category"}>
                      <Book className="mr-2 h-4 w-4" />
                      Category
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveContent("Jobs")} isActive={activeContent === "Jobs"}>
                      <FileText className="mr-2 h-4 w-4" />
                      Jobs
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveContent("Scholarships")} isActive={activeContent === "Scholarships"}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Scholarships
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
            <h1 className="font-semibold">{activeContent}</h1>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{activeContent}</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-500">
                    <Plus className="mr-2 h-4 w-4" /> Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>Add New {activeContent}</DialogTitle>
                      <DialogDescription>Enter details for the new {activeContent}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                          Name
                        </Label>
                        <Input id="name" {...register("name")} type="text" className="col-span-3" />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => reset()}>
                        Cancel
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-500" type="submit" disabled={isAddPending}>
                        {isAddPending ? "Adding..." : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl">Name</TableHead>
                  <TableHead className="text-xl">Created at</TableHead>
                  <TableHead className="text-xl text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeContent === "Category" ? (
                  <>
                    {categoryData?.data?.data?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" className="hover:text-white text-red-500 transition-all hover:bg-red-400" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {employerJobListData?.data?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Card>
                            <CardHeader>
                              <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div>{item.transaction_id === null ? <>not paid</> : <>paid</>}</div>
                              <div>Rs {item.salary}/-</div>
                              <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                            </CardContent>
                          </Card>
                        </TableCell>
                        <TableCell>{format(new Date(item.job_category.created_at), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" className="hover:text-white  text-green-500 transition-all hover:bg-green-400" onClick={() => handleApprove(item.id)}>
                            <MdDone className="h-6 w-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
