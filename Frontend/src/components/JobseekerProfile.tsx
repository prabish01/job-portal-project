'use client'

import { useMemo, useRef, useState } from "react"
import { PlusCircle, X, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profileFormValidation } from "../../action/validation"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import Swal from "sweetalert2"

// Define prop types
interface JobSeekerProfileProps {
  session: any
  user: {
    name: string
    email: string
    mobile: string
    permanent_address: string
  }
}

export default function JobSeekerProfile({ session, user }: JobSeekerProfileProps) {
  // Toast configuration
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer)
      toast.addEventListener("mouseleave", Swal.resumeTimer)
    },
  })

  // Avatar initials
  const getEmailInitials = (email: string) => {
    if (!email || email.trim() === "") return ""
    return email.charAt(0).toUpperCase()
  }
  const initials = useMemo(() => getEmailInitials(user.email || ""), [user.email])

  // State management
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email || "")
  const [location, setLocation] = useState(user.permanent_address || "")
  const [mobile, setMobile] = useState(user.mobile || "")

  // File handling
  const handleFileRead = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        setAvatarSrc(result)
        setError(null)
      } else {
        setError("Failed to load image")
      }
    }
    reader.onerror = () => {
      console.error("Error reading file")
      setError("Error reading file")
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  // Form setup
  const JsProfileForm = useForm<z.infer<typeof profileFormValidation>>({
    resolver: zodResolver(profileFormValidation),
    defaultValues: {
      current_address: "",
      permanent_address: "",
      professional_summary: "",
      skills: "",
      looking_for_job: true,
      educations: [{ institution: "", board: "", graduation_year: "", gpa: "" }],
      work_experiences: [{ title: "", company_name: "", joined_date: "", end_date: "", currently_working: false }],
    },
  })

  // Education and work experience management
  const { fields: educations, append: appendEducation, remove: removeEducation } = useFieldArray({ control: JsProfileForm.control, name: "educations" })
  const { fields: workExperiences, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({ control: JsProfileForm.control, name: "work_experiences" })

  // Form submission
  const onSubmit = async (values: z.infer<typeof profileFormValidation>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobseeker-profile/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "Profile updated successfully",
        })
      } else {
        throw new Error(data.message || "Failed to submit profile")
      }
    } catch (error) {
      console.error("Error Submitting Profile:", error)
      Toast.fire({
        icon: "error",
        title: "Failed to submit profile",
      })
    }
  }

  return (
    <div className="min-h-screen mt-32 mb-32">
      <div className="container mx-auto">
        <form onSubmit={JsProfileForm.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar upload */}
              <div className="flex flex-col items-start space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarSrc || ""} alt="User avatar" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="sr-only" aria-label="Upload profile picture" name="avatar" />
                  <Button type="button" onClick={handleButtonClick}>
                    {avatarSrc ? "Replace Image" : "Upload Image"}
                  </Button>
                </div>
                <Label htmlFor="avatar-upload" className="text-xs text-gray-400">
                  {avatarSrc ? "Click to change your profile picture" : "Click to upload a profile picture"}
                </Label>
              </div>
              
              {/* Personal information fields */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...JsProfileForm.register("name")} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" {...JsProfileForm.register("email")} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="johndoe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...JsProfileForm.register("permanent_address")} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter Your Location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Contact</Label>
                  <Input id="mobile" {...JsProfileForm.register("mobile")} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="1234567890" />
                </div>
              </div> */}
              
              {/* Skills and professional summary */}
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" {...JsProfileForm.register("skills")} placeholder="Enter your skills (comma separated)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional_summary">Professional Summary</Label>
                <Textarea id="professional_summary" {...JsProfileForm.register("professional_summary")} placeholder="Write a brief summary of your professional background" className="min-h-[100px]" />
              </div>
              
              {/* Citizenship documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="citizenship_front_image">Citizenship Front</Label>
                  <Input id="citizenship_front_image" type="file" accept="image/*" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizenship_back_image">Citizenship Back</Label>
                  <Input id="citizenship_back_image" type="file" accept="image/*" />
                </div>
              </div>
              
              {/* Job seeking status */}
              <div className="flex items-center space-x-2">
                <Switch id="looking_for_job" {...JsProfileForm.register("looking_for_job")} />
                <Label htmlFor="looking_for_job">Currently looking for job</Label>
              </div>
            </CardContent>
          </Card>

          {/* Education section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ institution: "", board: "", graduation_year: "", gpa: "" })}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {educations.map((field, index) => (
                <div key={field.id} className="relative border rounded-lg p-4">
                  {educations.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => removeEducation(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`educations.${index}.institution`}>Institution</Label>
                      <Input {...JsProfileForm.register(`educations.${index}.institution`)} placeholder="Enter institution name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`educations.${index}.board`}>Board</Label>
                      <Input {...JsProfileForm.register(`educations.${index}.board`)} placeholder="Enter board/university" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`educations.${index}.graduation_year`}>Graduation Year</Label>
                      <Input {...JsProfileForm.register(`educations.${index}.graduation_year`)} placeholder="YYYY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`educations.${index}.gpa`}>GPA</Label>
                      <Input {...JsProfileForm.register(`educations.${index}.gpa`)} placeholder="Enter GPA" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Work Experience section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => appendWorkExperience({ title: "", company_name: "", joined_date: "", end_date: "", currently_working: false })}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {workExperiences.map((field, index) => (
                <div key={field.id} className="relative border rounded-lg p-4">
                  {workExperiences.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => removeWorkExperience(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`work_experiences.${index}.title`}>Title</Label>
                      <Input {...JsProfileForm.register(`work_experiences.${index}.title`)} placeholder="Enter job title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`work_experiences.${index}.company_name`}>Company Name</Label>
                      <Input {...JsProfileForm.register(`work_experiences.${index}.company_name`)} placeholder="Enter company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`work_experiences.${index}.joined_date`}>Start Date</Label>
                      <Input {...JsProfileForm.register(`work_experiences.${index}.joined_date`)} type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`work_experiences.${index}.end_date`}>End Date</Label>
                      <Input {...JsProfileForm.register(`work_experiences.${index}.end_date`)} type="date" />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch {...JsProfileForm.register(`work_experiences.${index}.currently_working`)} />
                        <Label htmlFor={`work_experiences.${index}.currently_working`}>I currently work here</Label>
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
      </div>
    </div>
  )
}