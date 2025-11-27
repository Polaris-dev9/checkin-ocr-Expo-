import { z } from 'zod';

const isValidDate = (value: string) => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const documentSchema = z.object({
  nationality: z.string().optional(),
  documentType: z.string().min(1, 'Obligatorio'),
  documentNumber: z.string().min(1, 'Obligatorio'),
  supportNumber: z.string().optional(),
  issueDate: z
    .string()
    .optional()
    .refine((val) => !val || isValidDate(val), { message: 'Fecha no válida' }),
  expiryDate: z
    .string()
    .optional()
    .refine((val) => !val || isValidDate(val), { message: 'Fecha no válida' }),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;


