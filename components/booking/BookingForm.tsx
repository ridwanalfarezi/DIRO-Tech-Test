"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  onFormChange: (data: BookingFormData, isValid: boolean) => void;
  defaultValues?: Partial<BookingFormData>;
}

export function BookingForm({ onFormChange, defaultValues }: BookingFormProps) {
  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<BookingFormData>({
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
    },
  });

  const watchedFields = watch();

  const handleChange = () => {
    onFormChange(watchedFields, isValid);
  };

  return (
    <Card className="border-0 shadow-xl bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-white">
            <User className="h-5 w-5" />
          </div>
          Your Details
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your information to complete the booking
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              autoComplete="name"
              {...register("name", {
                required: true,
                minLength: 2,
                onChange: handleChange,
              })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                onChange: handleChange,
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+62 812 3456 7890"
              {...register("phone", { onChange: handleChange })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
