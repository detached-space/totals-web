import { Monitor, Smartphone } from "lucide-react";

export function MobileRedirect() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-background)]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[var(--color-foreground)]/10 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-[var(--color-foreground)]/50" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Monitor className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3 text-[var(--color-foreground)]">
          Desktop Experience Required
        </h1>

        <p className="text-[var(--color-foreground)]/70 mb-8 leading-relaxed">
          This application is optimized for desktop computers. Please open this
          link on your PC or laptop for the best experience.
        </p>

        <div className="glass-panel p-6 rounded-xl border border-[var(--color-card-border)]">
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Better Performance
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  Desktop browsers provide optimal performance for data-heavy
                  applications
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Full Features
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  Access all features including advanced filters, bulk
                  operations, and detailed analytics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Better Viewing
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  Larger screens allow for better data visualization and easier
                  navigation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
