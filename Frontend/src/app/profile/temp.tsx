"use client";

import { PlusCircle, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus, Trash2 } from "lucide-react";
import type { Resume, ResumeEducation, ResumeWorkExperience } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";
import { ResumeDropzone } from "@/components/ResumeDropzone";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "@/lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "@/lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "@/lib/parse-resume-from-pdf/extract-resume-from-sections";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  professional_summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  looking_for_job: z.boolean(),
  educations: z.array(
    z.object({
      institution: z.string().min(1, "Institution is required"),
      board: z.string().min(1, "Board/University is required"),
      graduation_year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
      gpa: z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
    })
  ),
  work_experiences: z.array(
    z.object({
      title: z.string().min(1, "Job title is required"),
      company_name: z.string().min(1, "Company name is required"),
      joined_date: z.string().min(1, "Start date is required"),
      end_date: z.string().optional(),
      currently_working: z.boolean(),
    })
  ),
});
type FormValues = z.infer<typeof formSchema>;

export const ResumeTable = () => {
  const [educations, setEducations] = useState([
    {
      institution: "",
      board: "",
      graduation_year: "",
      gpa: "",
    },
  ]);

  const [workExperiences, setWorkExperiences] = useState([
    {
      title: "",
      company_name: "",
      joined_date: "",
      end_date: "",
      currently_working: false,
    },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      phone: "",
      professional_summary: "",
      skills: "",
      looking_for_job: false,
      educations: educations,
      work_experiences: workExperiences,
    },
  });
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [formData, setFormData] = useState<Resume>({
    profile: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      url: "",
    },
    skills: {
      descriptions: [],
      featuredSkills: [],
    },
    educations: [deepClone(initialEducation) as ResumeEducation],
    workExperiences: [deepClone(initialWorkExperience) as ResumeWorkExperience],
    custom: { descriptions: [] },
    projects: [],
    name: undefined,
    email: "",
    phone: "",
    location: "",
    summary: "",
  });

  useEffect(() => {
    if (!fileUrl) return;
    async function loadTextItems() {
      const textItems = await readPdf(fileUrl as string);
      setTextItems(textItems);
    }
    loadTextItems();
  }, [fileUrl]);

  useEffect(() => {
    if (textItems.length === 0) return;
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);
    setFormData((prev) => ({
      ...prev,
      profile: resume.profile,
      skills: resume.skills,
      educations: resume.educations.length ? resume.educations : [deepClone(initialEducation)],
      workExperiences: resume.workExperiences.length ? resume.workExperiences : [deepClone(initialWorkExperience)],
    }));
  }, [textItems]);

  const handleEducationChange = (index: number, field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newEducations = [...prev.educations];
      newEducations[index] = { ...newEducations[index], [field]: value };
      return { ...prev, educations: newEducations };
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        descriptions: skillsArray,
      },
    }));
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newWorkExperiences = [...prev.workExperiences];
      newWorkExperiences[index] = { ...newWorkExperiences[index], [field]: value };
      return { ...prev, workExperiences: newWorkExperiences };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [...prev.educations, deepClone(initialEducation)],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [...prev.workExperiences, deepClone(initialWorkExperience)],
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
  };

  const handleProfileSubmit = async (values: FormValues) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <div className="pt-4 pb-4">
            <ResumeDropzone className="text-center" onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || "")} playgroundView={true} />
          </div>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.profile.name} {...form.register("name")} />
              {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
              {form.formState.errors.location && <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...form.register("phone")} />
              {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="professional_summary">Professional Summary</Label>
            <Textarea id="professional_summary" value={formData.profile.summary} {...form.register("professional_summary")} className="min-h-[100px]" />
            {form.formState.errors.professional_summary && <p className="text-sm text-red-500">{form.formState.errors.professional_summary.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" value={formData.skills.descriptions.join(", ")} {...form.register("skills")} />
            {form.formState.errors.skills && <p className="text-sm text-red-500">{form.formState.errors.skills.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile_image">Profile Image</Label>
              <Input id="profile_image" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume">Resume</Label>
              <Input id="resume" type="file" accept=".pdf,.doc,.docx" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="looking_for_job" {...form.register("looking_for_job")} />
            <Label htmlFor="looking_for_job">Currently looking for job</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addEducation}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.educations.map((education, index) => (
            <div key={index} className="relative border rounded-lg p-4">
              {educations.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => removeEducation(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${index}`}>Institution</Label>
                  <Input id={`institution-${index}`} value={education.school} {...form.register(`educations.${index}.institution`)} />
                  {form.formState.errors.educations?.[index]?.institution && <p className="text-sm text-red-500">{form.formState.errors.educations[index].institution.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`board-${index}`}>Board</Label>
                  <Input id={`board-${index}`} {...form.register(`educations.${index}.board`)} />
                  {form.formState.errors.educations?.[index]?.board && <p className="text-sm text-red-500">{form.formState.errors.educations[index].board.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`graduation-year-${index}`}>Graduation Year</Label>
                  <Input id={`graduation-year-${index}`} {...form.register(`educations.${index}.graduation_year`)} />
                  {form.formState.errors.educations?.[index]?.graduation_year && <p className="text-sm text-red-500">{form.formState.errors.educations[index].graduation_year.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`gpa-${index}`}>GPA</Label>
                  <Input id={`gpa-${index}`} {...form.register(`educations.${index}.gpa`)} />
                  {form.formState.errors.educations?.[index]?.gpa && <p className="text-sm text-red-500">{form.formState.errors.educations[index].gpa.message}</p>}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addWorkExperience}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {workExperiences.map((experience, index) => (
            <div key={index} className="relative border rounded-lg p-4">
              {formData.workExperiences.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => removeWorkExperience(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Title</Label>
                  <Input id={`title-${index}`} value={experience.title} {...form.register(`work_experiences.${index}.title`)} />
                  {form.formState.errors.work_experiences?.[index]?.title && <p className="text-sm text-red-500">{form.formState.errors.work_experiences[index].title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`company-${index}`}>Company Name</Label>
                  <Input id={`company-${index}`} {...form.register(`work_experiences.${index}.company_name`)} />
                  {form.formState.errors.work_experiences?.[index]?.company_name && <p className="text-sm text-red-500">{form.formState.errors.work_experiences[index].company_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`joined-date-${index}`}>Start Date</Label>
                  <Input id={`joined-date-${index}`} type="date" {...form.register(`work_experiences.${index}.joined_date`)} />
                  {form.formState.errors.work_experiences?.[index]?.joined_date && <p className="text-sm text-red-500">{form.formState.errors.work_experiences[index].joined_date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`end-date-${index}`}>End Date</Label>
                  <Input id={`end-date-${index}`} type="date" {...form.register(`work_experiences.${index}.end_date`)} disabled={form.watch(`work_experiences.${index}.currently_working`)} />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch id={`currently-working-${index}`} {...form.register(`work_experiences.${index}.currently_working`)} />
                    <Label htmlFor={`currently-working-${index}`}>I currently work here</Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        <Upload className="w-4 h-4 mr-2" />
        Submit Resume
      </Button>
    </form>
  );
};
