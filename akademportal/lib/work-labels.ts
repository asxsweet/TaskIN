import type { Language, WorkType, WorkStatus } from "@prisma/client";

export function workTypeLabel(t: WorkType) {
  const m: Record<WorkType, string> = {
    DIPLOMA: "Дипломдық жұмыс",
    COURSE: "Курстық жұмыс",
    ARTICLE: "Ғылыми мақала",
    ESSAY: "Эссе",
    PROJECT: "Жоба",
  };
  return m[t];
}

export function languageLabel(l: Language) {
  const m: Record<Language, string> = {
    KAZAKH: "Қазақша",
    RUSSIAN: "Орысша",
    ENGLISH: "Ағылшынша",
  };
  return m[l];
}

export function workStatusLabel(s: WorkStatus) {
  const m: Record<WorkStatus, string> = {
    APPROVED: "Бекітілді",
    PENDING: "Тексеруде",
    RETURNED: "Қайтарылды",
    REJECTED: "Қабылданбады",
  };
  return m[s];
}

export function roleLabel(r: string) {
  const m: Record<string, string> = {
    STUDENT: "Студент",
    SUPERVISOR: "Жетекші",
    ADMIN: "Әкімші",
  };
  return m[r] ?? r;
}
