"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus, Trash2 } from "lucide-react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";

type ResumeDisplayProps = {
  resume: Resume;
};

const resumeTable = ({ resume }: ResumeDisplayProps) => {
  const educations = resume.educations.length === 0 ? [deepClone(initialEducation)] : resume.educations;

  const workExperiences = resume.workExperiences.length === 0 ? [deepClone(initialWorkExperience)] : resume.workExperiences;

  const skills = [...resume.skills.descriptions];
  const featuredSkills = resume.skills.featuredSkills
    .filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();

  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
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

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Professional Bio</h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Bio</CardTitle>
          <CardDescription>Upload your resume or enter your details manually</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="johndoe@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, State, Country" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Professional Summary</h2>
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea id="summary" name="summary" value={formData.summary} onChange={handleInputChange} placeholder="Write a brief summary of your professional experience and skills..." className="min-h-[100px]" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Education</h2>
                {formData.educations.length > 0 ? (
                  formData.educations.map((education, index) => (
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
                          <Label htmlFor={`gpa-${index}`}>GPA</Label>
                          <Input id={`gpa-${index}`} value={education.gpa} onChange={(e) => handleEducationChange(index, "gpa", e.target.value)} placeholder="GPA" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea id={`description-${index}`} value={education.descriptions.join(", ")} onChange={(e) => handleEducationChange(index, "descriptions", e.target.value.split(", "))} placeholder="Enter descriptions" className="min-h-[80px]" />
                      </div>
                      <Button type="button" variant="destructive" onClick={() => removeEducation(index)} className="mt-2">
                        <Trash2 size={16} /> Remove Education
                      </Button>
                    </div>
                  ))
                ) : (
                  <div>No education entries available.</div>
                )}
                <Button type="button" onClick={addEducation} className="mt-4">
                  <Plus size={16} /> Add Education
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
                {formData.workExperiences.length > 0 ? (
                  formData.workExperiences.map((workExperience, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`company-${index}`}>Company</Label>
                          <Input id={`company-${index}`} value={workExperience.company} onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)} placeholder="Company name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                          <Input id={`jobTitle-${index}`} value={workExperience.jobTitle} onChange={(e) => handleWorkExperienceChange(index, "jobTitle", e.target.value)} placeholder="Job title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`date-${index}`}>Date</Label>
                          <Input id={`date-${index}`} value={workExperience.date} onChange={(e) => handleWorkExperienceChange(index, "date", e.target.value)} placeholder="Employment dates" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor={`workDescription-${index}`}>Description</Label>
                        <Textarea id={`workDescription-${index}`} value={workExperience.descriptions.join(", ")} onChange={(e) => handleWorkExperienceChange(index, "descriptions", e.target.value.split(", "))} placeholder="Enter work descriptions" className="min-h-[80px]" />
                      </div>
                      <Button type="button" variant="destructive" onClick={() => removeWorkExperience(index)} className="mt-2">
                        <Trash2 size={16} /> Remove Work Experience
                      </Button>
                    </div>
                  ))
                ) : (
                  <div>No work experience entries available.</div>
                )}
                <Button type="button" onClick={addWorkExperience} className="mt-4">
                  <Plus size={16} /> Add Work Experience
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (separate by commas)</Label>
                  <Input id="skills" value={formData.skills.descriptions.join(", ")} onChange={handleSkillsChange} placeholder="e.g., JavaScript, React, Node.js" />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => setPdfFile(null)}>
            <Upload size={16} /> Upload PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
