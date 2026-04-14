import { z } from "zod";

/** Select "" → undefined; Prisma id (cuid/nanoid т.б.) үшін cuid() емес, ұзындық тексеруі */
const optionalId = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().min(1).max(128).optional()
);

const roleEnum = z.enum(["STUDENT", "SUPERVISOR", "ADMIN"]);
const workTypeEnum = z.enum(["DIPLOMA", "COURSE", "ARTICLE", "ESSAY", "PROJECT"]);
const languageEnum = z.enum(["KAZAKH", "RUSSIAN", "ENGLISH"]);
const workStatusEnum = z.enum(["PENDING", "APPROVED", "RETURNED", "REJECTED"]);
const decisionEnum = z.enum(["APPROVE", "RETURN", "REJECT"]);

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email({ message: "Жарамды email енгізіңіз" }),
    password: z.string().min(8).max(128),
    role: z.enum(["STUDENT", "SUPERVISOR"]).default("STUDENT"),
    facultyId: optionalId,
    departmentId: optionalId,
    position: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(32).optional(),
    employeeId: z.string().trim().max(64).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "SUPERVISOR") {
      if (!data.departmentId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Кафедраны таңдаңыз",
          path: ["departmentId"],
        });
      }
      if (!data.position?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Қызметін енгізіңіз", path: ["position"] });
      }
      if (!data.phone?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Телефонды енгізіңіз", path: ["phone"] });
      }
      if (!data.employeeId?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Куәлік нөмірін енгізіңіз", path: ["employeeId"] });
      }
    } else if (!data.facultyId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Факультетті таңдаңыз",
        path: ["facultyId"],
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const workCreateSchema = z.object({
  title: z.string().min(3).max(500),
  abstract: z.string().min(20),
  type: workTypeEnum,
  year: z.number().int().min(1990).max(2100),
  language: languageEnum,
  /** Prisma id (cuid т.б.) — тек қатаң cuid() форматы әрдайым сәйкес келмей қалады */
  departmentId: z.string().min(1, "Кафедраны таңдаңыз").max(128),
  supervisorId: optionalId,
  keywordNames: z.array(z.string().min(1).max(64)).max(20).optional(),
});

export const workUpdateSchema = workCreateSchema.partial().extend({
  status: workStatusEnum.optional(),
});

export const reviewCreateSchema = z
  .object({
    relevance: z.number().min(1).max(5),
    methodology: z.number().min(1).max(5),
    formatting: z.number().min(1).max(5),
    conclusion: z.number().min(1).max(5),
    strengths: z.string().min(10),
    suggestions: z.string().min(10),
    comment: z.string().min(1),
    decision: decisionEnum,
    returnReason: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "RETURN" || data.decision === "REJECT") {
      if (!data.returnReason?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Себебін жазыңыз",
          path: ["returnReason"],
        });
      }
    }
  });

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  avatar: z.string().url().optional().nullable(),
  facultyId: z.string().cuid().optional(),
});
