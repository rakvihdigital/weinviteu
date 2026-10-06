import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { templateIsVisible } from "@/lib/template-visibility";
import TemplatesCatalogue from "./TemplatesCatalogue";

export const revalidate = 0;

export default async function TemplatesPage() {
  const [categories, templates] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("display_order", { ascending: true }),
    supabase.from("templates").select("*").neq("enabled", false),
  ]);
  const error = categories.error || templates.error;
  const activeCategories = error ? [] : categories.data || [];
  const visibleTemplates = error ? [] : (templates.data || []).filter(template => templateIsVisible(template, activeCategories));
  return (
    <Suspense fallback={<p role="status">Loading collection…</p>}>
      <TemplatesCatalogue templates={visibleTemplates} activeCategories={activeCategories}
        error={error ? "Could not load templates. Please refresh to try again." : ""} />
    </Suspense>
  );
}
