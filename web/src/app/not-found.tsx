import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto px-8 py-20 text-center">
      <div className="text-[64px] font-extrabold tracking-[-1px] text-primary">404</div>
      <div className="font-bold text-[18px] mb-1">Page not found</div>
      <p className="text-muted mb-6">That opportunity may have closed or moved.</p>
      <Link href="/" className="text-primary font-semibold">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
