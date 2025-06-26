import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <SignIn />
    </div>
  );
}
