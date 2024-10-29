export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: string;
}

export interface ResumeWorkExperience {
  role: string | number | readonly string[] | undefined;
  location: string | number | readonly string[] | undefined;
  startDate: string | number | readonly string[] | undefined;
  endDate: string | number | readonly string[] | undefined;
  position: string | number | readonly string[] | undefined;
  dateRange: string | number | readonly string[] | undefined;
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
}

export interface ResumeEducation {
  location: string | number | readonly string[] | undefined;
  school: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
}

export interface ResumeProject {
  project: string;
  date: string;
  descriptions: string[];
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Resume {
  name: string | number | readonly string[] | undefined;
  email: string | number | readonly string[] | undefined;
  phone: string | number | readonly string[] | undefined;
  location: string | number | readonly string[] | undefined;
  summary: string | number | readonly string[] | undefined;
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
}

export type ResumeKey = keyof Resume;
