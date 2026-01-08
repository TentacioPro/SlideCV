export interface ContactInfo {
  email: string;
  linkedin: string;
  portfolio: string;
}

export interface CandidateProfile {
  full_name: string;
  target_title: string;
  location: string;
  contact_info: ContactInfo;
}

export interface ExperienceHighlight {
  company: string;
  role: string;
  duration: string;
  bullet_points: string[];
}

export interface EducationShort {
  degree: string;
  institution: string;
  year: string;
}

export interface SlideContent {
  professional_summary: string;
  core_competencies: string[];
  experience_highlights: ExperienceHighlight[];
  education_short: EducationShort[];
}

export interface SlideData {
  candidate_profile: CandidateProfile;
  slide_content: SlideContent;
}

export interface DesignSuggestions {
  suggested_theme_color: string;
  candidate_seniority_level: string;
}

export interface SlideResult extends SlideData {
  design_suggestions?: DesignSuggestions;
}