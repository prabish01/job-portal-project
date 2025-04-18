import { useMutation, useQuery } from "@tanstack/react-query";

interface FetchCategoryProps {
  session: any;
}
export async function AddCategory(categoryName: string, { session }: FetchCategoryProps) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/job-category/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({ name: categoryName }), // Send category name in the body
    });

    const data = await response.json();
    console.log(data);
  } catch (error: any) {
    console.error("fetchCategory error:", error);
    return error;
  }
}

export function useFetchCategory(session: any) {
  return useQuery({
    queryKey: ["categoryListData"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job-category/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job list data");
      }

      const data = await response.json();
      console.log(data);

      return data;
    },
    // Uncomment the following line if you want to enable the query only when a session is present
    // enabled: !!session,
  });
}
export function useFetchEmployerJob(session: any) {
  return useQuery({
    queryKey: ["EmployerjobListData"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/job/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job list data");
      }

      const data = await response.json();
      console.log(data);

      return data;
    },
   
  });
}


export async function DeleteCategory({ session }: FetchCategoryProps) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/job-category/destroy/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    });

    const data = await response.json();
    console.log(data);
  } catch (error: any) {
    console.error("fetchCategory error:", error);
    return error;
  }
}
