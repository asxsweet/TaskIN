"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workCreateSchema } from "@/lib/validations";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UploadDropzone } from "@/components/works/UploadDropzone";
import { TagInput } from "@/components/ui/TagInput";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { Toast } from "@/components/ui/Toast";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";

type Form = z.infer<typeof workCreateSchema>;

export default function UploadPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [faculties, setFaculties] = useState<{ id: string; name: string; departments: { id: string; name: string }[] }[]>(
    []
  );
  const [supervisors, setSupervisors] = useState<{ id: string; name: string }[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const form = useForm<Form>({
    resolver: zodResolver(workCreateSchema),
    defaultValues: {
      title: "",
      abstract: "",
      type: "DIPLOMA",
      year: new Date().getFullYear(),
      language: "KAZAKH",
      departmentId: "",
      supervisorId: undefined,
      keywordNames: [],
    },
  });

  useEffect(() => {
    apiJsonSafe<{
      faculties?: { id: string; name: string; departments: { id: string; name: string }[] }[];
    }>("/api/public/faculties", { faculties: [] }).then((d) => setFaculties(d.faculties ?? []));
  }, []);

  useEffect(() => {
    apiJsonSafe<{ supervisors?: { id: string; name: string }[] }>("/api/public/supervisors", {
      supervisors: [],
    }).then((d) => setSupervisors(d.supervisors?.map((u) => ({ id: u.id, name: u.name })) ?? []));
  }, []);

  const deptOptions = faculties.flatMap((f) => f.departments.map((d) => ({ f, d })));
  const noFaculties = faculties.length === 0;
  const noSupervisors = supervisors.length === 0;

  async function onSubmit(values: Form) {
    if (!file) {
      setMsg("Файл қажет");
      return;
    }
    if (noFaculties || deptOptions.length === 0) {
      setMsg("Факультет/кафедра қосылмаған");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("metadata", JSON.stringify({ ...values, keywordNames: values.keywordNames ?? [] }));
    const r = await fetch("/api/works", { method: "POST", credentials: "include", body: fd });
    if (!r.ok) {
      const raw = await r.text();
      try {
        const j = JSON.parse(raw) as { error?: string };
        setMsg(j.error ?? raw);
      } catch {
        setMsg(raw);
      }
      return;
    }
    setMsg("Сәтті жүктелді");
    setStep(3);
  }

  return (
    <div className="max-w-4xl mx-auto -m-4 md:-m-8 px-4 py-8 space-y-8">
      <StepIndicator step={step} />
      {msg && <Toast variant={msg.includes("Сәтті") ? "success" : "error"}>{msg}</Toast>}

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">Жұмысты жүктеу</h1>
            <p className="text-neutral-500">Алдымен файлды таңдаңыз (PDF немесе DOCX)</p>
          </div>
          <UploadDropzone file={file} onFile={setFile} />
          <div className="flex justify-end">
            <Button type="button" disabled={!file} onClick={() => setStep(2)}>
              Әрі қарай
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {noFaculties ?
            <EmptyState
              title="Факультеттер әлі қосылмаған"
              description="Әкімшіге хабарласыңыз: әкім панелінен факультет пен кафедра қосу керек."
            />
          : null}
          {!noFaculties && deptOptions.length === 0 ?
            <EmptyState title="Кафедралар жоқ" description="Әкімші факультетке кафедра қосқанша күтіңіз." />
          : null}
          {noSupervisors ?
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Бекітілген жетекшілер жоқ — жетекші таңдау міндетті емес болуы мүмкін, бірақ ұсынылады.
            </div>
          : null}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">Тақырып</label>
            <Input {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">Аннотация</label>
            <textarea
              className="flex min-h-[120px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm"
              {...form.register("abstract")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">Түрі</label>
              <Select {...form.register("type")}>
                <option value="DIPLOMA">Диплом</option>
                <option value="COURSE">Курстық</option>
                <option value="ARTICLE">Мақала</option>
                <option value="ESSAY">Эссе</option>
                <option value="PROJECT">Жоба</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500">Жыл</label>
              <Input type="number" {...form.register("year", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">Тіл</label>
            <Select {...form.register("language")}>
              <option value="KAZAKH">Қазақша</option>
              <option value="RUSSIAN">Орысша</option>
              <option value="ENGLISH">Ағылшынша</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">Кафедра</label>
            <Select {...form.register("departmentId")}>
              <option value="">—</option>
              {faculties.flatMap((f) =>
                f.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {f.name} — {d.name}
                  </option>
                ))
              )}
            </Select>
            {form.formState.errors.departmentId ?
              <p className="text-xs text-red-600">{form.formState.errors.departmentId.message}</p>
            : null}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">Жетекші</label>
            <Select
              {...form.register("supervisorId", {
                setValueAs: (v) => (typeof v === "string" && v === "" ? undefined : v),
              })}
            >
              <option value="">—</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-500">Кілт сөздер</label>
            <TagInput
              value={form.watch("keywordNames") ?? []}
              onChange={(v) => form.setValue("keywordNames", v)}
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Артқа
            </Button>
            <Button type="submit" disabled={noFaculties || deptOptions.length === 0}>
              Жіберу
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Рахмет!</h2>
          <p className="text-neutral-600">Жұмысыңыз тексеруге жіберілді.</p>
        </div>
      )}
    </div>
  );
}
