import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ApiErrorProps {
  onRetry?: () => void;
}

export function ApiError({ onRetry }: ApiErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Connection Failed
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your local server is probably down
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  if (onRetry) {
                    onRetry();
                  } else {
                    window.location.reload();
                  }
                }}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
