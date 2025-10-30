import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
const testimonials = [
  {
    name: "Sarah L.",
    location: "London, UK",
    avatar: "https://i.pravatar.cc/150?img=1",
    text: "I was devastated after losing a significant amount to a crypto scam. Refundeee was professional, transparent, and relentless. They recovered over 80% of my funds. I can't thank them enough!",
  },
  {
    name: "John D.",
    location: "Manchester, UK",
    avatar: "https://i.pravatar.cc/150?img=2",
    text: "After my bank refused to help, I felt hopeless. The team at Refundeee took on my case and their expertise was evident from day one. They successfully recovered my money from an investment fraud.",
  },
  {
    name: "Emily R.",
    location: "Birmingham, UK",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "The compulsory fee felt like a leap of faith, but it was the best decision I made. Their process is thorough, and they kept me informed every step of the way. Highly recommended.",
  },
];
const processSteps = [
    { title: "Submit Your Case", description: "Fill out our detailed, secure form with all the information about your case. The more details, the better." },
    { title: "Case Review & Strategy", description: "Our experts analyze your submission, gather evidence, and develop a tailored recovery strategy." },
    { title: "Fund Recovery", description: "We execute the recovery plan, liaising with banks, crypto exchanges, and authorities on your behalf." },
    { title: "Funds Returned", description: "Once successful, the recovered funds are transferred directly back to you, minus our success fee." },
];
const faqs = [
    { q: "Why is there a compulsory facilitator's fee?", a: "The $1000 fee covers essential administrative, legal, and operational costs required to initiate the recovery process. It allows us to dedicate expert resources to your case from the very beginning, ensuring a thorough and efficient investigation." },
    { q: "What is your success rate?", a: "While every case is unique and success cannot be guaranteed, we have a strong track record of recovering funds for our clients. Our success rate is among the highest in the industry, which is reflected in our client testimonials and reviews." },
    { q: "How long does the recovery process take?", a: "The timeline for fund recovery can vary significantly depending on the complexity of the case, the institutions involved, and the type of scam. It can range from a few weeks to several months. We provide regular updates throughout the process." },
    { q: "Are you affiliated with government agencies?", a: "No, Refundeee is an independent fund recovery firm. We work alongside, but are not part of, any government agencies, law enforcement, or financial institutions. This independence allows us to act swiftly and solely in our clients' best interests." },
];
export function HomePage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-foreground">
            Your Trusted Partner in Fund Recovery
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            We specialize in helping victims of online scams recover their lost funds. Our team of experts is dedicated to fighting for your financial justice.
          </p>
          <div className="mt-10 max-w-2xl mx-auto p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Compulsory Facilitator's Fee: $1000 per Case</h2>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              This fee is required to cover essential administrative and operational costs, ensuring we can initiate and efficiently manage your recovery process from the onset.
            </p>
          </div>
          <div className="mt-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/signup">Start Your Recovery Today</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Trust & Validation Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center">
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <p className="font-semibold text-foreground">4.9 / 5 Average Rating</p>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" alt="Trustpilot" className="h-8 dark:hidden" />
              <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" alt="Trustpilot" className="h-8 hidden dark:block" />
              <p className="text-muted-foreground">Verified by TrustPilot</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-green-500" />
              <p className="font-semibold text-foreground">Over 2,000 Satisfied Clients</p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Process Section */}
      <section id="process" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-display">A Straightforward Recovery Process</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">We've simplified the path to recovering your funds into four clear steps.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                    <div key={index} className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground mx-auto">
                            <span className="text-xl font-bold">{index + 1}</span>
                        </div>
                        <h3 className="mt-5 text-lg font-medium text-foreground">{step.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display">What Our Clients Say</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Real stories from people we've helped.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">"{testimonial.text}"</p>
                </CardContent>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Video Testimonials Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Real Stories from Real Clients</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Watch video testimonials from clients who recovered their funds with our help.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-display">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full mt-12">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg text-left">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>
    </AppLayout>
  );
}