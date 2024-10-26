"use client";

import { useState, useEffect } from "react";
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

const ResumeTable = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [formData, setFormData] = useState<Resume>({
    profile: {
      name: "", email: "", phone: "", location: "", summary: "", url: ""
    },
    skills: {
      descriptions: [],
      featuredSkills: []
    },
    educations: [deepClone(initialEducation) as ResumeEducation],
    workExperiences: [deepClone(initialWorkExperience) as ResumeWorkExperience],
    custom: { descriptions: [] },
    projects: [],
    name: undefined,
    email: "",
    phone: "",
    location: "",
    summary: ""
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, profile: { ...prev.profile, [name]: value } }));
  };

  const handleEducationChange = (index: number, field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newEducations = [...prev.educations];
      newEducations[index] = { ...newEducations[index], [field]: value };
      return { ...prev, educations: newEducations };
    });
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="min-h-screen  mx-auto px-4 py-8">
      <div className="container ">
        <p className="text-3xl mb-5 font-bold text-start ">Your Professional Profile</p>
        <div>
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>

              <CardDescription>Upload your resume or enter your details manually</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className=" space-y-4">
                  <div className="pt-4 pb-4">
                    <ResumeDropzone className="text-center" onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || "")} playgroundView={true} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.profile.name} onChange={handleInputChange} placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.profile.email} onChange={handleInputChange} placeholder="johndoe@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.profile.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={formData.profile.location} onChange={handleInputChange} placeholder="City, State, Country" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Professional Summary</h2>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea id="summary" name="summary" value={formData.profile.summary} onChange={handleInputChange} placeholder="Write a brief summary of your professional experience and skills..." className="min-h-[100px]" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Education</h2>
                    {formData.educations.map((education, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`school-${index}`}>School</Label>
                            <Input id={`school-${index}`} value={education.school} onChange={(e) => handleEducationChange(index, "school", e.target.value)} placeholder="School or University name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${index}`}>Degree</Label>
                            <Input id={`degree-${index}`} value={education.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} placeholder="Degree obtained" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`date-${index}`}>Date</Label>
                            <Input id={`date-${index}`} value={education.date} onChange={(e) => handleEducationChange(index, "date", e.target.value)} placeholder="Graduation date" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`location-${index}`}>Location</Label>
                            <Input id={`location-${index}`} value={education.location} onChange={(e) => handleEducationChange(index, "location", e.target.value)} placeholder="School location" />
                          </div>
                        </div>
                        <div className="flex mt-4 justify-end">
                          <Button variant="destructive" onClick={() => removeEducation(index)}>
                            <Trash2 className="mr-2" />
                            Remove Education
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addEducation} className="mt-2">
                      <Plus className="mr-2" />
                      Add Education
                    </Button>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
                    {formData.workExperiences.map((experience, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`company-${index}`}>Company</Label>
                            <Input id={`company-${index}`} value={experience.company} onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)} placeholder="Company name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`role-${index}`}>Role</Label>
                            <Input id={`role-${index}`} value={experience.role} onChange={(e) => handleWorkExperienceChange(index, "role", e.target.value)} placeholder="Role or job title" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`date-${index}`}>Date</Label>
                            <Input id={`date-${index}`} value={experience.date} onChange={(e) => handleWorkExperienceChange(index, "date", e.target.value)} placeholder="Dates of employment" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`location-${index}`}>Location</Label>
                            <Input id={`location-${index}`} value={experience.location} onChange={(e) => handleWorkExperienceChange(index, "location", e.target.value)} placeholder="Company location" />
                          </div>
                        </div>
                        <div className="flex mt-4 justify-end">
                          <Button variant="destructive" onClick={() => removeWorkExperience(index)}>
                            <Trash2 className="mr-2" />
                            Remove Experience
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addWorkExperience} className="mt-2">
                      <Plus className="mr-2" />
                      Add Work Experience
                    </Button>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Skills</h2>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea id="skills" value={formData.skills.descriptions.join(", ")} onChange={handleSkillsChange} placeholder="Separate skills with commas" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
          <section className="">{fileUrl && <iframe src={fileUrl} className="w-full rounded-xl h-[50rem] mt-4 border" />}</section>
        </div>
      </div>
    </div>
  );
};

export default ResumeTable;
