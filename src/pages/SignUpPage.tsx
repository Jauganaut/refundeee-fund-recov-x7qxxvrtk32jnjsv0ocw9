import { AppLayout } from "@/components/layout/AppLayout";
import { SignUpForm } from "@/components/SignUpForm";
export function SignUpPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 lg:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground">
              Start Your Recovery Process
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Please provide as much detail as possible. This information is crucial for us to begin assessing your case.
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </AppLayout>
  );
}