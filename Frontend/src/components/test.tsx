"use client";
import * as z from "zod";

import * as React from "react";
import { Book, FileText, GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/app/SessionProvider";
import { useFetchCategory } from "@/app/(role)/admin/api/fetchCategroy";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { categoryNameValidation } from "../../action/validation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ContentType = "Category" | "guidelines" | "scholarships";

export default function Component() {
  const session = useSession();
  const queryClient = useQueryClient(); // Access queryClient to call invalidateQueries

  // const [addcategoryName, setaddCategoryName] = useState("");
  const [isaddPending, setisAddPending] = useState(false);
  type inputCategory = z.infer<typeof categoryNameValidation>;

  const addCategoryForm = useForm({
    resolver: zodResolver(categoryNameValidation),
    defaultValues: {
      name: "",
    },
  });

  const {
    register,
    handleSubmit: handleAddCategory,
    formState: { errors },
  } = addCategoryForm;

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

  const [activeContent, setActiveContent] = React.useState<ContentType>("Category");
  const addCategoryName = useMutation({
    mutationFn: async (formData: inputCategory) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job-category/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }
      return data;
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: `${data.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["jobListData"] });

      // form.reset();

      console.log("Job created successfully", data);
    },
    onError: (data) => {
      Toast.fire({
        icon: "error",
        title: `${data.message}`,
      });
    },
    onSettled: () => {
      setisAddPending(false);
    },
  });
  const deleteCategory = useMutation({
    mutationFn: async (categoryId) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job-category/destroy/${categoryId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }
      return data;
    },
    onSuccess: () => {
      Toast.fire({
        icon: "success",
        title: "Category deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["jobListData"] });
    },
    onError: (data) => {
      Toast.fire({
        icon: "error",
        title: `${data.message}`,
      });
    },
  });

  const handleDelete = (categoryId: any) => {
    deleteCategory.mutate(categoryId);
    console.log("Delete category", categoryId);
  };

  const onSubmit = async (formData: inputCategory) => {
    setisAddPending(true);
    console.log("Form data:", formData);

    // Validate the category name using Zod
    try {
      await addCategoryName.mutateAsync(formData);
    } catch (error: any) {
      console.error(errors);
    } finally {
      setisAddPending(false);
      console.log("Finally");
    }
  };
  const { isPending: categoryPending, error: categoryError, data: categoryData } = useFetchCategory(session?.token);
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
        <h1>Loading...</h1>
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
                    <SidebarMenuButton onClick={() => setActiveContent("guidelines")} isActive={activeContent === "guidelines"}>
                      <FileText className="mr-2 h-4 w-4" />
                      Guidelines
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveContent("scholarships")} isActive={activeContent === "scholarships"}>
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
            <h1 className="font-semibold">{activeContent.charAt(0).toUpperCase() + activeContent.slice(1)}</h1>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{activeContent.charAt(0).toUpperCase() + activeContent.slice(1)}</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-500">
                    <Plus className="mr-2 h-4 w-4" /> Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form method="POST" onSubmit={handleAddCategory(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>Add New {activeContent.slice(0, -1)}</DialogTitle>
                      <DialogDescription>Enter Name for the new Category.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                          Title
                        </Label>
                        <Input id="name" {...register("name")} type="text" className="col-span-3" />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-green-600 hover:bg-green-500" type="submit" disabled={isaddPending}>
                        {isaddPending ? "Adding..." : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData?.data?.data?.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{format(new Date(category.created_at), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    <TableCell className="text-right">
                      {/* <Button variant="ghost" className="hover:text-yellow-500" onClick={handleAddCategory}>
                        <Pencil />
                      </Button> */}

                      <Button variant="ghost" className="hover:text-red-500" onClick={() => handleDelete(category.id)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </main>
        </div>
      </div>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {activeContent.slice(0, -1)}</DialogTitle>
            <DialogDescription>Make changes to the selected item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input id="edit-title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input id="edit-description" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            {/* <Button onClick={handleEdit}>Save Changes</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
