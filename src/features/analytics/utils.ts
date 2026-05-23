import {
  Code,
  GraduationCap,
  Dumbbell,
  Palette,
  Mail,
  Coffee,
  FileText,
  User,
  Brain
} from "lucide-react";

// Map categories to dynamic Lucide icons
export const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("code") || cat.includes("developer") || cat.includes("dev") || cat.includes("db") || cat.includes("sql") || cat.includes("optimization")) {
    return Code;
  }
  if (cat.includes("study") || cat.includes("learning") || cat.includes("research") || cat.includes("read") || cat.includes("book")) {
    return GraduationCap;
  }
  if (cat.includes("exercise") || cat.includes("gym") || cat.includes("workout") || cat.includes("sport") || cat.includes("health")) {
    return Dumbbell;
  }
  if (cat.includes("design") || cat.includes("ui") || cat.includes("ux") || cat.includes("art") || cat.includes("draw")) {
    return Palette;
  }
  if (cat.includes("mail") || cat.includes("email") || cat.includes("newsletter") || cat.includes("outreach") || cat.includes("client")) {
    return Mail;
  }
  if (cat.includes("break") || cat.includes("relax") || cat.includes("coffee") || cat.includes("tea")) {
    return Coffee;
  }
  if (cat.includes("doc") || cat.includes("write") || cat.includes("article") || cat.includes("paper")) {
    return FileText;
  }
  if (cat.includes("profile") || cat.includes("personal") || cat.includes("user")) {
    return User;
  }
  return Brain;
};

// Map categories to consistent lavender/indigo (deep) vs peach/orange (routine) styling
export const getCategoryColors = (category: string) => {
  const cat = category.toLowerCase();
  const isDeep =
    cat.includes("project") ||
    cat.includes("study") ||
    cat.includes("personal") ||
    cat.includes("deep") ||
    cat.includes("code") ||
    cat.includes("ui") ||
    cat.includes("dev") ||
    cat.includes("design") ||
    cat === "focus" ||
    cat === "";

  if (isDeep) {
    return { bg: "bg-[#c0c1ff]/10", text: "text-[#c0c1ff]" };
  } else {
    return { bg: "bg-[#ffb783]/10", text: "text-[#ffb783]" };
  }
};

// Format timestamps relatively (e.g. Just now, Yesterday, 2 days ago)
export const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export const getPeriodLabel = (daysRange: number) => {
  if (daysRange === 7) return "vs last 7 days";
  if (daysRange === 14) return "vs last 14 days";
  return "vs last 30 days";
};
