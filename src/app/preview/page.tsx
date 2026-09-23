import SharedInvitation from "@/components/SharedInvitation";
export const metadata = {
  title: "Your invitation preview",
  robots: { index: false, follow: false },
};
export default function Preview() {
  return <SharedInvitation preview />;
}
