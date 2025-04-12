'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

/* 1.This is the schema for the pharmacy sign-up form
*  It uses Zod for validation
 */
const PharmacySignUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Pharmacy name must be at least 2 characters long')
    .max(100, 'Pharmacy name must be under 100 characters'),
});

// 2. Type Inference from the schema
type FormData = z.infer<typeof PharmacySignUpSchema>;

// 3. The SignUp component
export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PharmacySignUpSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  const onError = (errors: any) => {
    console.error(errors);
  };

  const handleFormSubmit = handleSubmit(onSubmit, onError);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md bg-white p-8 rounded-xl shadow-md"
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          Pharmacy Signup
        </h1>

        {/* Name of Pharmacy */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Pharmacy Name
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g. Apollo Pharmacy"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <Button type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
