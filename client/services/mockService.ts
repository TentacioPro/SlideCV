import { SlideResult } from '../types';

const MOCK_DATA: SlideResult = {
  candidate_profile: {
    full_name: "Alex Sterling",
    target_title: "Senior Product Manager",
    location: "San Francisco, CA",
    contact_info: {
      email: "alex.sterling@example.com",
      linkedin: "linkedin.com/in/alexsterling",
      portfolio: "alexsterling.product"
    }
  },
  slide_content: {
    professional_summary: "Strategic Product Leader with 7+ years of experience scaling SaaS platforms. Expert in agile methodologies, data-driven decision making, and cross-functional team leadership to drive revenue growth.",
    core_competencies: [
      "Product Strategy",
      "Agile & Scrum",
      "User Research",
      "GTM Strategy",
      "Data Analytics",
      "Stakeholder Management",
      "SaaS Growth",
      "UX/UI Principles"
    ],
    experience_highlights: [
      {
        company: "TechNova Solutions",
        role: "Senior Product Manager",
        duration: "2021 - Present",
        bullet_points: [
          "Led launch of flagship AI analytics tool, achieving $2M ARR in first year.",
          "Optimized user onboarding flow, increasing retention by 25%."
        ]
      },
      {
        company: "CreativStream",
        role: "Product Owner",
        duration: "2018 - 2021",
        bullet_points: [
          "Managed roadmap for mobile app with 500k+ MAU.",
          "Reduced churn by 15% through implemented feedback loops."
        ]
      },
      {
        company: "Innovate Inc.",
        role: "Associate PM",
        duration: "2016 - 2018",
        bullet_points: [
          "Collaborated with engineering to ship 4 major feature updates.",
          "Conducted market research to identify key competitive advantages."
        ]
      }
    ],
    education_short: [
      {
        degree: "MBA, Tech Management",
        institution: "Stanford GSB",
        year: "2016"
      },
      {
        degree: "BS, Computer Science",
        institution: "UC Berkeley",
        year: "2014"
      }
    ]
  },
  design_suggestions: {
    suggested_theme_color: "#4F46E5",
    candidate_seniority_level: "Senior"
  }
};

export const analyzeResume = async (file: File): Promise<SlideResult> => {
  return new Promise((resolve) => {
    // Simulate API network delay
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 2500);
  });
};