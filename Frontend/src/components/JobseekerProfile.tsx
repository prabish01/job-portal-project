"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/app/SessionProvider";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Education {
  institution: string;
  board: string;
  graduation_year: string;
  gpa: string;
}

interface WorkExperience {
  title: string;
  company_name: string;
  joined_date: string;
  end_date: string;
  currently_working: boolean;
}

export default function JobseekerProfile() {
  const session = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    professional_summary: "",
    skill: "",
    looking_for_job: false,
    educations: [{ institution: "", board: "", graduation_year: "", gpa: "" }],
    work_experiences: [
      {
        title: "",
        company_name: "",
        joined_date: "",
        end_date: "",
        currently_working: false,
      },
    ],
  });

  const [files, setFiles] = useState({
    image: null,
    citizenship_front_image: null,
    citizenship_back_image: null,
    resume: null,
  });

  const createProfile = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker-profile/store`;
        console.log("Submitting to:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
          body: data,
        });

        const text = await response.text();
        console.log("Server response:", text);

        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse response:", text);
          throw new Error("Server returned an invalid response");
        }
      } catch (error) {
        console.error("Submission error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile created successfully",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/jobseeker/view-profile");
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create profile",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Basic Information - all fields are optional
    formDataToSend.append("professional_summary", formData.professional_summary || "");
    formDataToSend.append("skill", formData.skill || "");
    formDataToSend.append("looking_for_job", formData.looking_for_job ? "1" : "0");

    // Education - optional array
    if (formData.educations?.length > 0) {
      formData.educations.forEach((edu, index) => {
        // Only append if at least one field has a value
        if (edu.institution || edu.board || edu.graduation_year || edu.gpa) {
          formDataToSend.append(`educations[${index}][institution]`, edu.institution || "");
          formDataToSend.append(`educations[${index}][board]`, edu.board || "");
          formDataToSend.append(`educations[${index}][graduation_year]`, edu.graduation_year || "");
          formDataToSend.append(`educations[${index}][gpa]`, edu.gpa || "");
        }
      });
    }

    // Work Experience - optional array
    if (formData.work_experiences?.length > 0) {
      formData.work_experiences.forEach((exp, index) => {
        // Only append if at least one field has a value
        if (exp.title || exp.company_name || exp.joined_date || exp.end_date) {
          formDataToSend.append(`work_experiences[${index}][title]`, exp.title || "");
          formDataToSend.append(`work_experiences[${index}][company_name]`, exp.company_name || "");
          formDataToSend.append(`work_experiences[${index}][joined_date]`, exp.joined_date || "");
          formDataToSend.append(`work_experiences[${index}][end_date]`, exp.end_date || "");
          formDataToSend.append(`work_experiences[${index}][currently_working]`, exp.currently_working ? "1" : "0");
        }
      });
    }

    // Files - all optional
    // if (files.image instanceof File) {
    //   formDataToSend.append("image", files.image);
    // }
    // if (files.citizenship_front_image instanceof File) {
    //   formDataToSend.append("citizenship_front_image", files.citizenship_front_image);
    // }
    // if (files.citizenship_back_image instanceof File) {
    //   formDataToSend.append("citizenship_back_image", files.citizenship_back_image);
    // }
    // if (files.resume instanceof File) {
    //   formDataToSend.append("resume", files.resume);
    // }

    // Log the data being sent
    // console.log("Submitting FormData:");
    // for (let [key, value] of formDataToSend.entries()) {
    //   console.log(key, ":", value);
    // }

    try {
      await createProfile.mutateAsync(formDataToSend);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Jobseeker Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={4} value={formData.professional_summary} onChange={(e) => setFormData({ ...formData, professional_summary: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={formData.skill} onChange={(e) => setFormData({ ...formData, skill: e.target.value })} />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={formData.looking_for_job} onChange={(e) => setFormData({ ...formData, looking_for_job: e.target.checked })} />
              <label className="ml-2 block text-sm text-gray-900">Currently looking for job</label>
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(files).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</label>
                <input
                  type="file"
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={(e) =>
                    setFiles({
                      ...files,
                      [key]: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Education</h2>

          {formData.educations.map((education, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={education.institution}
                    onChange={(e) => {
                      const newEducations = [...formData.educations];
                      newEducations[index].institution = e.target.value;
                      setFormData({ ...formData, educations: newEducations });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Board</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={education.board}
                    onChange={(e) => {
                      const newEducations = [...formData.educations];
                      newEducations[index].board = e.target.value;
                      setFormData({ ...formData, educations: newEducations });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={education.graduation_year}
                    onChange={(e) => {
                      const newEducations = [...formData.educations];
                      newEducations[index].graduation_year = e.target.value;
                      setFormData({ ...formData, educations: newEducations });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GPA</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={education.gpa}
                    onChange={(e) => {
                      const newEducations = [...formData.educations];
                      newEducations[index].gpa = e.target.value;
                      setFormData({ ...formData, educations: newEducations });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Work Experience */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Work Experience</h2>

          {formData.work_experiences.map((experience, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={experience.title}
                    onChange={(e) => {
                      const newExperiences = [...formData.work_experiences];
                      newExperiences[index].title = e.target.value;
                      setFormData({ ...formData, work_experiences: newExperiences });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={experience.company_name}
                    onChange={(e) => {
                      const newExperiences = [...formData.work_experiences];
                      newExperiences[index].company_name = e.target.value;
                      setFormData({ ...formData, work_experiences: newExperiences });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={experience.joined_date}
                    onChange={(e) => {
                      const newExperiences = [...formData.work_experiences];
                      newExperiences[index].joined_date = e.target.value;
                      setFormData({ ...formData, work_experiences: newExperiences });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={experience.end_date}
                    disabled={experience.currently_working}
                    onChange={(e) => {
                      const newExperiences = [...formData.work_experiences];
                      newExperiences[index].end_date = e.target.value;
                      setFormData({ ...formData, work_experiences: newExperiences });
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={experience.currently_working}
                      onChange={(e) => {
                        const newExperiences = [...formData.work_experiences];
                        newExperiences[index].currently_working = e.target.checked;
                        setFormData({ ...formData, work_experiences: newExperiences });
                      }}
                    />
                    <label className="ml-2 block text-sm text-gray-900">Currently working here</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createProfile.isPending}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {createProfile.isPending ? "Creating..." : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
