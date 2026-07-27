import { Loading } from "@/components/ui/spinner";

/** Global route-transition fallback (Suspense) for all locale routes. */
export default function LocaleLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loading size={32} />
    </div>
  );
}
