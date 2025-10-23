import type {
  BusinessProfileFormData,
  ContentPreferencesFormData,
} from "./validations";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OnboardingData {
  businessProfile: BusinessProfileFormData;
  contentPreferences: ContentPreferencesFormData;
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  category: string;
}

export interface PostIdea {
  id: string;
  title: string;
  content: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  context: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const INDIAN_FESTIVALS: Festival[] = [
  {
    id: "diwali",
    name: "Diwali",
    date: "October 2025",
    description:
      "Festival of Lights - Celebrating the victory of light over darkness",
    category: "Hindu",
  },
  {
    id: "holi",
    name: "Holi",
    date: "March 2026",
    description: "Festival of Colors - Celebrating the arrival of spring",
    category: "Hindu",
  },
  {
    id: "eid",
    name: "Eid al-Fitr",
    date: "March 2026",
    description: "Festival marking the end of Ramadan",
    category: "Islamic",
  },
  {
    id: "christmas",
    name: "Christmas",
    date: "December 25",
    description: "Celebrating the birth of Jesus Christ",
    category: "Christian",
  },
  {
    id: "raksha-bandhan",
    name: "Raksha Bandhan",
    date: "August 2025",
    description: "Celebrating the bond between brothers and sisters",
    category: "Hindu",
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    date: "September 2025",
    description: "Celebrating the birth of Lord Ganesha",
    category: "Hindu",
  },
  {
    id: "navratri",
    name: "Navratri",
    date: "October 2025",
    description: "Nine nights celebrating the divine feminine",
    category: "Hindu",
  },
  {
    id: "pongal",
    name: "Pongal",
    date: "January 2026",
    description: "Harvest festival celebrated in South India",
    category: "Hindu",
  },
  {
    id: "independence-day",
    name: "Independence Day",
    date: "August 15",
    description: "Celebrating India's independence",
    category: "National",
  },
  {
    id: "republic-day",
    name: "Republic Day",
    date: "January 26",
    description: "Celebrating the Constitution of India",
    category: "National",
  },
];

const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    id: "q1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    context: "Perfect for business inspiration and Monday motivation posts",
  },
  {
    id: "q2",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    context: "Great for encouraging your audience during challenging times",
  },
  {
    id: "q3",
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    context: "Ideal for posts about authenticity and following your passion",
  },
  {
    id: "q4",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    context: "Perfect for showcasing your business's innovative approach",
  },
  {
    id: "q5",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    context: "Great for encouraging audience to take action today",
  },
  {
    id: "q6",
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle",
    context: "Perfect for highlighting your commitment to quality",
  },
  {
    id: "q7",
    text: "The customer's perception is your reality.",
    author: "Kate Zabriskie",
    context: "Excellent for customer service focused posts",
  },
  {
    id: "q8",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    context: "Motivational content for persistence and dedication",
  },
];

export const mockApi = {
  async saveBusinessProfile(
    data: BusinessProfileFormData
  ): Promise<ApiResponse<{ id: string }>> {
    await delay(800);

    console.log("Mock API: Saving business profile", data);

    return {
      success: true,
      data: { id: `profile_${Date.now()}` },
    };
  },

  async saveContentPreferences(
    data: ContentPreferencesFormData
  ): Promise<ApiResponse<{ id: string }>> {
    await delay(800);

    console.log("Mock API: Saving content preferences", data);

    return {
      success: true,
      data: { id: `preferences_${Date.now()}` },
    };
  },

  async completeOnboarding(
    data: OnboardingData
  ): Promise<ApiResponse<{ redirectUrl: string }>> {
    await delay(1000);

    console.log("Mock API: Completing onboarding", data);

    return {
      success: true,
      data: { redirectUrl: "/dashboard" },
    };
  },

  async getFestivals(): Promise<ApiResponse<Festival[]>> {
    await delay(500);
    return {
      success: true,
      data: INDIAN_FESTIVALS,
    };
  },

  async getQuotes(): Promise<ApiResponse<Quote[]>> {
    await delay(500);
    return {
      success: true,
      data: MOTIVATIONAL_QUOTES,
    };
  },

  async generateFestivalPostIdeas(
    festivalId: string,
    businessProfile: BusinessProfileFormData
  ): Promise<ApiResponse<PostIdea[]>> {
    await delay(1000);

    const festival = INDIAN_FESTIVALS.find((f) => f.id === festivalId);
    if (!festival) {
      return {
        success: false,
        error: "Festival not found",
      };
    }

    const postIdeas: PostIdea[] = [
      {
        id: `${festivalId}-1`,
        title: `Special ${festival.name} Offer`,
        content: `Celebrate ${festival.name} with ${
          businessProfile.businessName
        }! 🎉\n\nThis ${
          festival.name
        }, we're bringing you special offers that light up your celebrations. ${
          festival.description
        }\n\nVisit us today and make this festival memorable!\n\n#${festival.name.replace(
          /\s+/g,
          ""
        )} #${businessProfile.category.replace(/\s+/g, "")} #FestivalOffer`,
      },
      {
        id: `${festivalId}-2`,
        title: `${festival.name} Wishes from ${businessProfile.businessName}`,
        content: `Wishing you and your loved ones a joyous ${
          festival.name
        }! ✨\n\n${
          festival.description
        }\n\nMay this festival bring prosperity, happiness, and success to your life.\n\nFrom all of us at ${
          businessProfile.businessName
        }\n\n#Happy${festival.name.replace(
          /\s+/g,
          ""
        )} #FestivalGreetings #${businessProfile.businessName.replace(
          /\s+/g,
          ""
        )}`,
      },
      {
        id: `${festivalId}-3`,
        title: `${festival.name} Special Collection`,
        content: `Introducing our exclusive ${
          festival.name
        } collection! 🌟\n\n${
          businessProfile.description
        }\n\nPerfect for your ${
          festival.name
        } celebrations. Limited time only!\n\n#${festival.name.replace(
          /\s+/g,
          ""
        )}Special #${businessProfile.category.replace(
          /\s+/g,
          ""
        )} #FestivalShopping`,
      },
      {
        id: `${festivalId}-4`,
        title: `How We Celebrate ${festival.name}`,
        content: `At ${businessProfile.businessName}, ${
          festival.name
        } is extra special! 🎊\n\n${
          festival.description
        }\n\nWe're celebrating by offering you the best experience in ${
          businessProfile.category
        }. Join us in making this festival unforgettable!\n\n#${festival.name.replace(
          /\s+/g,
          ""
        )}2025 #Celebration #${businessProfile.businessName.replace(
          /\s+/g,
          ""
        )}`,
      },
    ];

    return {
      success: true,
      data: postIdeas,
    };
  },

  async generateProductPromotionIdeas(
    businessProfile: BusinessProfileFormData,
    contentPreferences: ContentPreferencesFormData
  ): Promise<ApiResponse<PostIdea[]>> {
    await delay(1000);

    const goals = contentPreferences.goals.join(", ");
    const postIdeas: PostIdea[] = [
      {
        id: "promo-1",
        title: "Highlight Your Best Seller",
        content: `Discover what makes ${
          businessProfile.businessName
        } stand out! 🌟\n\nOur customers love us for ${
          businessProfile.description
        }\n\nAs a trusted name in ${
          businessProfile.category
        }, we focus on ${goals}.\n\n👉 Visit us today and experience the difference!\n\n#${businessProfile.businessName.replace(
          /\s+/g,
          ""
        )} #${businessProfile.category.replace(/\s+/g, "")} #QualityService`,
      },
      {
        id: "promo-2",
        title: "Limited Time Offer",
        content: `🎉 Special Announcement from ${
          businessProfile.businessName
        }!\n\nFor a limited time, enjoy exclusive benefits when you choose us.\n\nWhy choose us?\n✅ ${
          businessProfile.description
        }\n✅ Focus on ${goals}\n✅ Trusted in ${
          businessProfile.category
        }\n\nDon't miss out! Contact us now.\n\n#LimitedOffer #${businessProfile.category.replace(
          /\s+/g,
          ""
        )} #SpecialDeal`,
      },
      {
        id: "promo-3",
        title: "Customer Success Story",
        content: `💡 See why customers choose ${
          businessProfile.businessName
        }\n\n"${
          businessProfile.description
        }"\n\nOur commitment to ${goals} in the ${
          businessProfile.category
        } industry sets us apart.\n\n🌟 Join our growing family of satisfied customers today!\n\n#CustomerLove #${businessProfile.businessName.replace(
          /\s+/g,
          ""
        )} #Testimonial`,
      },
      {
        id: "promo-4",
        title: "Behind the Scenes",
        content: `Ever wondered what goes into making ${
          businessProfile.businessName
        } special? 🎬\n\n${
          businessProfile.description
        }\n\nOur focus on ${goals} drives everything we do in ${
          businessProfile.category
        }.\n\nExperience the ${
          businessProfile.businessName
        } difference today!\n\n#BehindTheScenes #${businessProfile.category.replace(
          /\s+/g,
          ""
        )} #OurStory`,
      },
    ];

    return {
      success: true,
      data: postIdeas,
    };
  },

  async generateEducationalContentIdeas(
    businessProfile: BusinessProfileFormData,
    contentPreferences: ContentPreferencesFormData
  ): Promise<ApiResponse<PostIdea[]>> {
    await delay(1000);

    const goals = contentPreferences.goals[0] || "customer satisfaction";
    const postIdeas: PostIdea[] = [
      {
        id: "edu-1",
        title: "Industry Tips & Tricks",
        content: `📚 Expert Tips from ${
          businessProfile.businessName
        }\n\nDid you know? Here are 3 essential tips about ${
          businessProfile.category
        }:\n\n1️⃣ Quality matters more than quantity\n2️⃣ Research before making decisions\n3️⃣ Trust experienced professionals\n\n${
          businessProfile.description
        }\n\nHave questions? We're here to help!\n\n#${businessProfile.category.replace(
          /\s+/g,
          ""
        )}Tips #ExpertAdvice #EducationalContent`,
      },
      {
        id: "edu-2",
        title: "Common Mistakes to Avoid",
        content: `⚠️ 5 Common Mistakes in ${businessProfile.category}\n\nAt ${
          businessProfile.businessName
        }, we've seen it all. Here's what to avoid:\n\n❌ Rushing important decisions\n❌ Ignoring expert advice\n❌ Choosing price over quality\n❌ Not asking questions\n❌ Skipping research\n\nOur goal is ${goals}. Let us guide you!\n\n#CommonMistakes #${businessProfile.category.replace(
          /\s+/g,
          ""
        )} #LearnAndGrow`,
      },
      {
        id: "edu-3",
        title: "How-To Guide",
        content: `🎯 Your Complete Guide to ${
          businessProfile.category
        }\n\nStep 1: Understand your needs\nStep 2: Research your options\nStep 3: Consult with experts\nStep 4: Make an informed decision\n\n${
          businessProfile.description
        }\n\nAt ${
          businessProfile.businessName
        }, we're committed to ${goals}.\n\n#HowToGuide #${businessProfile.category.replace(
          /\s+/g,
          ""
        )} #ExpertHelp`,
      },
      {
        id: "edu-4",
        title: "Did You Know? - Industry Facts",
        content: `💡 Did You Know?\n\nInteresting facts about ${
          businessProfile.category
        }:\n\n🔹 The industry is constantly evolving\n🔹 Expert guidance makes a huge difference\n🔹 Quality and trust are paramount\n\n${
          businessProfile.businessName
        }: ${
          businessProfile.description
        }\n\nOur focus on ${goals} ensures you get the best experience!\n\n#DidYouKnow #${businessProfile.category.replace(
          /\s+/g,
          ""
        )}Facts #IndustryInsights`,
      },
      {
        id: "edu-5",
        title: "Myth vs Reality",
        content: `🔍 Myth vs Reality in ${
          businessProfile.category
        }\n\n❌ MYTH: All providers are the same\n✅ REALITY: Experience and quality matter\n\n❌ MYTH: Cheapest is always best\n✅ REALITY: Value comes from quality service\n\nAt ${
          businessProfile.businessName
        }, ${
          businessProfile.description
        }\n\n#MythVsReality #${businessProfile.category.replace(
          /\s+/g,
          ""
        )} #TruthRevealed`,
      },
    ];

    return {
      success: true,
      data: postIdeas,
    };
  },
};
