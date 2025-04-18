"use client";
import { useSession } from "@/app/SessionProvider";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FiBriefcase, FiMail, FiMapPin, FiPhone, FiAward, FiUser, FiFileText } from "react-icons/fi";

interface JobseekerProfileData {
  data: {
    id: number;
    jobseeker_id: number;
    professional_summary: string;
    skill: string[];
    image: string | null;
    image_path: string;
    citizenship_front_image: string | null;
    citizenship_back_image: string | null;
    resume: string | null;
    looking_for_job: number;
    education: any[];
    work_experience: any[];
    jobseeker: {
      id: number;
      name: string;
      email: string;
      mobile: string;
      current_address: string;
      permanent_address: string;
    };
  };
}

export default function JobseekerProfileDisplay() {
  const session = useSession();

  const { data: profileData, isLoading } = useQuery<JobseekerProfileData>({
    queryKey: ["jobseeker-profile"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker-profile/list`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!session?.token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const profile = profileData?.data;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* <div className="relative h-40 w-40 rounded-2xl overflow-hidden border-4 border-white/10">
              <Image src={profile.image_path ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${profile.image_path}` : "/default-avatar.png"} alt={profile.jobseeker.name} fill className="object-cover" priority />
            </div> */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.jobseeker.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100 mb-4">
                <FiMail className="h-4 w-4" />
                <span>{profile.jobseeker.email}</span>
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${profile.looking_for_job ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>{profile.looking_for_job ? "✓ Available for Work" : "Not Currently Available"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="h-5 w-5 text-blue-600" />
                Contact Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{profile.jobseeker.mobile}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-600">
                      <span className="text-sm text-gray-500">Current:</span>
                      <br />
                      {profile.jobseeker.current_address}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <span className="text-sm text-gray-500">Permanent:</span>
                      <br />
                      {profile.jobseeker.permanent_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiAward className="h-5 w-5 text-blue-600" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skill?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Documents */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-blue-600" />
                Documents
              </h2>
              {profile.resume_path && (
                <a
                  href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${profile.resume_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiFileText className="h-5 w-5" />
                  <span>View Resume</span>
                </a>
              )}
            </div> */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.professional_summary}</p>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiBriefcase className="h-5 w-5 text-blue-600" />
                Work Experience
              </h2>
              <div className="space-y-6">
                {profile.work_experience?.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-blue-100 last:pb-0">
                    <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-blue-600"></div>
                    <div className="mb-4 pb-4">
                      <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company_name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(exp.joined_date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {exp.currently_working
                          ? "Present"
                          : new Date(exp.end_date).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiAward className="h-5 w-5 text-blue-600" />
                Education
              </h2>
              <div className="space-y-6">
                {profile.education?.map((edu, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-blue-100 last:pb-0">
                    <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-blue-600"></div>
                    <div className="mb-4 pb-4">
                      <h3 className="text-lg font-medium text-gray-900">{edu.institution}</h3>
                      <p className="text-gray-600">{edu.board}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Graduated {edu.graduation_year} • GPA: {edu.gpa}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
