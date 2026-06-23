import { redirect } from "next/navigation";
import { signIn, authEnabled } from "@/auth";

export default function SignInPage() {
  // In dev (auth disabled) there's nothing to sign into — go home.
  if (!authEnabled) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5] px-6">
      <div className="w-full max-w-[380px] bg-white border border-[#ECEBE6] rounded-[16px] p-8 text-center shadow-[0_8px_30px_rgba(28,27,26,0.06)]">
        <div className="w-12 h-12 mx-auto rounded-[12px] bg-gradient-to-br from-[#5046E5] to-[#7C5BF0] mb-4" />
        <h1 className="text-[24px] font-extrabold tracking-[-0.5px]">Srijan</h1>
        <p className="text-[14px] text-[#76746E] mt-1 mb-6">Where Ideas Become Impact</p>
        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full h-11 rounded-[9px] bg-[#5046E5] text-white font-bold text-sm shadow-[0_2px_8px_rgba(80,70,229,0.3)] cursor-pointer"
          >
            Sign in with Microsoft
          </button>
        </form>
      </div>
    </div>
  );
}
