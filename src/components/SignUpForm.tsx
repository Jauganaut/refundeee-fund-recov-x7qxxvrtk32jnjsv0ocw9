import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster, toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import type { Case, Profile } from "@shared/types";
const formSchema = z.object({
  amount_lost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number()
     .min(1, "Amount must be greater than 0")
  ),
  scam_type: z.string().min(1, { message: "Please select a scam type" }),
  uk_bank_account: z.enum(["yes", "no"], { errorMap: () => ({ message: "This field is required" }) }),
  payment_method: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  bank_name: z.string().min(1, "Bank name is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  scam_description: z.string().min(10, "Please provide a brief summary").max(500),
  first_payment_date: z.date({ errorMap: () => ({ message: "A date is required." }) }),
  heard_from: z.string().min(1, { message: "Please select an option" }),
});
type FormData = z.infer<typeof formSchema>;
const scamTypes = ["Crypto scam", "Investment scam", "'Safe account' (fake bank, HMRC impersonation)", "Purchase scam (goods or services)", "Romance/friendship", "Invoice scam", "Job 'task' scam", "Other"];
const paymentMethods = [
  { id: "uk_bank_transfer", label: "UK bank transfer(s) (branch, app or online banking)" },
  { id: "card_payment", label: "Card payment(s)" },
  { id: "international_payment", label: "International payment system - like Wise, Moneygram, Western Union" },
  { id: "crypto_transfer", label: "Crypto transfer to a wallet (e.g., Coinbase, Binance, Kraken)" },
  { id: "other", label: "Other" },
];
const heardFromOptions = ["Youtube", "A Friend", "Google", "TikTok", "Property Tribes", "Facebook Or Instagram", "Other"];
const steps: { id: string; title: string; fields: (keyof FormData)[] }[] = [
  { id: "step1", title: "Initial Details", fields: ["amount_lost", "scam_type", "uk_bank_account"] },
  { id: "step2", title: "Payment Information", fields: ["payment_method", "bank_name"] },
  { id: "step3", title: "Personal Information", fields: ["first_name", "last_name", "email", "phone"] },
  { id: "step4", title: "Case Summary", fields: ["scam_description", "first_payment_date", "heard_from"] },
];
export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useAuth(s => s.login);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount_lost: undefined,
      scam_type: "",
      payment_method: [],
      bank_name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      scam_description: "",
      heard_from: "",
    },
  });
  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields);
    if (!output) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        uk_bank_account: data.uk_bank_account === "yes",
        first_payment_date: format(data.first_payment_date, "yyyy-MM-dd"),
      };
      const response = await api<{ profile: Profile; case: Case }>('/api/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success("Registration successful!", {
        description: "Your case has been submitted. Redirecting to your dashboard...",
      });
      login(response.profile);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("Registration Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const progress = ((currentStep + 1) / steps.length) * 100;
  return (
    <>
      <Toaster richColors />
      <div className="w-full max-w-2xl mx-auto">
        <Progress value={progress} className="mb-8" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-6">{steps[currentStep].title}</h2>
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <FormField control={form.control} name="amount_lost" render={({ field }) => (
                      <FormItem>
                        <FormLabel>How much money did you lose? (in $)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : e.target.valueAsNumber)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="scam_type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>What type of scam was it?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a scam type" /></SelectTrigger></FormControl>
                          <SelectContent>{scamTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="uk_bank_account" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Did you send money from or to a UK bank account?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="yes" /></FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="no" /></FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField control={form.control} name="payment_method" render={({ field }) => (
                      <FormItem>
                        <div className="mb-4"><FormLabel>How did you pay the fraudsters?</FormLabel></div>
                        {paymentMethods.map((item) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.label)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.label])
                                    : field.onChange(field.value?.filter((value) => value !== item.label));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bank_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which bank(s) did you send the money from?</FormLabel>
                        <FormControl><Input placeholder="e.g., HSBC, Barclays" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="first_name" render={({ field }) => (
                        <FormItem><FormLabel>First name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="last_name" render={({ field }) => (
                        <FormItem><FormLabel>Surname</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone number</FormLabel><FormControl><Input type="tel" placeholder="+44 123 456 7890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <FormField control={form.control} name="scam_description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did the scam happen?</FormLabel>
                        <FormControl><Textarea placeholder="Provide a 1-2 sentence summary..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="first_payment_date" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>When did you make the first payment?</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="heard_from" render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you hear about Refundeee?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl>
                          <SelectContent>{heardFromOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Case
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}