import React, { useMemo } from "react";
import { UserProfile } from "@shared/saas-schema";

interface CustomTemplateRendererProps {
  profile: UserProfile;
  htmlCode: string;
}

/**
 * Renders a custom HTML template (created via ChatGPT) in a sandboxed iframe.
 * Replaces {{placeholders}} with actual profile data before injecting.
 */
export function CustomTemplateRenderer({ profile, htmlCode }: CustomTemplateRendererProps) {
  const processedHtml = useMemo(() => {
    // Build social links JSON for injection
    const socialLinksJson = JSON.stringify(profile.socialLinks || []);

    // Build social links as HTML list items
    const socialLinksHtml = (profile.socialLinks || [])
      .map((link: any) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" data-platform="${link.platform}">${link.label || link.platform}</a>`)
      .join("\n");

    // Build apps list HTML
    const appsHtml = (profile.apps || [])
      .map((app: any) => `<a href="${app.url}" target="_blank" rel="noopener noreferrer" class="app-link" data-name="${app.name}">${app.name}</a>`)
      .join("\n");

    let html = htmlCode;

    // Replace all placeholders
    const replacements: Record<string, string> = {
      "{{fullName}}":    profile.fullName || "",
      "{{bio}}":         profile.bio || "",
      "{{jobTitle}}":    profile.jobTitle || "",
      "{{location}}":    profile.location || "",
      "{{email}}":       profile.email || "",
      "{{phone}}":       profile.phone || "",
      "{{whatsapp}}":    profile.whatsapp || "",
      "{{website}}":     profile.website || "",
      "{{avatarUrl}}":   profile.avatarUrl || "",
      "{{coverUrl}}":    profile.coverUrl || "",
      "{{username}}":    profile.username || "",
      "{{socialLinksJson}}": socialLinksJson,
      "{{socialLinksHtml}}": socialLinksHtml,
      "{{appsHtml}}":    appsHtml,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      // Replace all occurrences (global replace)
      html = html.split(placeholder).join(value);
    }

    return html;
  }, [profile, htmlCode]);

  return (
    <iframe
      title="custom-template-preview"
      srcDoc={processedHtml}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      className="w-full border-none"
      style={{ minHeight: "100vh", display: "block" }}
    />
  );
}

/**
 * Preview version — same but with sample data for admin preview.
 */
export function CustomTemplatePreview({ htmlCode }: { htmlCode: string }) {
  const sampleProfile: Partial<UserProfile> = {
    fullName: "أحمد بن علي",
    bio: "مطور واجهات أمامية متخصص في React وTypeScript.",
    jobTitle: "مطور Full Stack",
    location: "الجزائر العاصمة، الجزائر",
    email: "ahmed@example.com",
    phone: "+213 55 123 4567",
    whatsapp: "+213551234567",
    website: "https://ahmed.novawebdv.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    coverUrl: "",
    username: "ahmed",
    socialLinks: [
      { platform: "github",    url: "https://github.com/ahmed",    label: "GitHub" },
      { platform: "linkedin",  url: "https://linkedin.com/in/ahmed", label: "LinkedIn" },
      { platform: "twitter",   url: "https://twitter.com/ahmed",   label: "Twitter" },
    ],
    apps: [],
  };

  return (
    <CustomTemplateRenderer
      profile={sampleProfile as UserProfile}
      htmlCode={htmlCode}
    />
  );
}
