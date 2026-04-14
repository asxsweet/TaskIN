/**
 * Prisma enum мәндері — `@prisma/client` ішіндегі ApprovalStatus/Role объектілері
 * кейде runtime-да undefined болуы мүмкін (generate қатесі). Сол үшін осында тұрақты жолдар.
 */
export const R = {
  STUDENT: "STUDENT",
  SUPERVISOR: "SUPERVISOR",
  ADMIN: "ADMIN",
} as const;

export const A = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
