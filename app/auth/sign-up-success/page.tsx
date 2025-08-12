import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, LogIn } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl" data-testid="signup-success-heading">
                Account Created Successfully!
              </CardTitle>
              <CardDescription>
                Welcome to RFP Content Management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center" data-testid="signup-success-message">
                Your account has been created successfully. You can now sign in to access your dashboard.
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full" size="lg">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In Now
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center">
                  Having trouble?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Contact support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
