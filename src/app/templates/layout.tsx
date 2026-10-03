import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Templates",
  description:
    "Explore our premium collection of 3D digital invitation templates for every occasion.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
