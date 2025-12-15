import { Users, Clock, Sparkles } from "lucide-react";

export default function People() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[var(--color-foreground)]/10 flex items-center justify-center">
              <Users className="w-12 h-12 text-[var(--color-foreground)]/50" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[var(--color-foreground)]">
          People
        </h1>

        <div className="flex items-center justify-center gap-2 mb-6 text-[var(--color-foreground)]/60">
          <Clock className="w-5 h-5" />
          <p className="text-lg">Coming Soon</p>
        </div>

        <p className="text-[var(--color-foreground)]/50 text-base mb-8 max-w-md mx-auto">
          We're building a powerful people management feature that will help you
          track interactions, manage contacts, and analyze your transaction
          relationships.
        </p>

        <div className="glass-panel p-6 rounded-xl border border-[var(--color-card-border)]">
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-foreground)]">
            Planned Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Contact Management
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  Organize and manage your transaction contacts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Relationship Analytics
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  Track transaction patterns with contacts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Top Counterparties
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  See your most frequent transaction partners
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[var(--color-foreground)] mb-1">
                  Contact Insights
                </h3>
                <p className="text-xs text-[var(--color-foreground)]/50">
                  Detailed transaction history per contact
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
