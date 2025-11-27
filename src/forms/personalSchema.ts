import { z } from 'zod';

const isValidPastDate = (value: string) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return !isNaN(date.getTime()) && date <= now;
};

export const personalSchema = z.object({
  firstName: z.string().min(1, 'Obligatorio'),
  lastName: z.string().min(1, 'Obligatorio'),
  gender: z.string().optional(),
  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || isValidPastDate(val), {
      message: 'Fecha no válida',
    }),
  email: z
    .string()
    .email('Email no válido')
    .optional()
    .or(z.literal('')),
});

export type PersonalFormValues = z.infer<typeof personalSchema>;


