import { z } from 'zod'
import { isRealIsoDate } from './dates'
import { isHttpUrl } from './http-url'

const isoDate = z.string().refine(isRealIsoDate, {
  message: 'Use a real YYYY-MM-DD calendar date (example: 2026-09-06)',
})

const sourceSchema = z.object({
  label: z.string().min(1),
  url: z
    .string()
    .url()
    .refine(isHttpUrl, { message: 'Source URL must use http or https' }),
})

const sectionSchema = z.object({
  heading: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  sources: z.array(sourceSchema).optional(),
})

export const digestUpdateSchema = z.object({
  $schema: z.string().optional(),
  date: isoDate,
  title: z.string().min(1),
  summary: z.string().min(1),
  tone: z.string().min(1).max(40).optional(),
  sections: z.array(sectionSchema).min(1),
  bottomLine: z.string().min(1),
})

export type DigestUpdateData = z.infer<typeof digestUpdateSchema>
export type DigestUpdate = { id: string; data: DigestUpdateData }
