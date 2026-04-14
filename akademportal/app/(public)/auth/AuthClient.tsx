"use client";

import { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiJsonSafe } from "@/lib/fetcher";
import { Logo } from "@/components/layout/Logo";

type FacultyRow = { id: string; name: string; departments: { id: string; name: string }[] };

export default function AuthClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">(
    (params.get("tab") as "login" | "register") || "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registerRole, setRegisterRole] = useState<"STUDENT" | "SUPERVISOR">("STUDENT");
  const [facultyId, setFacultyId] = useState("");
  const [supervisorFacultyId, setSupervisorFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [faculties, setFaculties] = useState<FacultyRow[]>([]);
  const [facultiesLoading, setFacultiesLoading] = useState(true);
  const [facultiesError, setFacultiesError] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [supervisorSubmitted, setSupervisorSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadFaculties() {
      setFacultiesLoading(true);
      setFacultiesError(null);
      try {
        const r = await fetch("/api/public/faculties", { cache: "no-store" });
        const data = (await r.json()) as {
          faculties?: FacultyRow[];
          message?: string;
          error?: string;
        };
        if (cancelled) return;
        if (!r.ok) {
          setFaculties([]);
          setFacultiesError(data.message || "Факультеттерді жүктеу сәтсіз (сервер қатесі).");
          return;
        }
        const list = Array.isArray(data.faculties) ? data.faculties : [];
        setFaculties(list);
        if (list.length === 0) {
          setFacultiesError(
            "Факультеттер дерекқорда жоқ. Терминалда: npm run db:push және npm run db:seed"
          );
        } else {
          setFacultiesError(null);
        }
      } catch {
        if (!cancelled) {
          setFaculties([]);
          setFacultiesError("Желі қатесі. Интернетті тексеріп, бетті жаңартыңыз.");
        }
      } finally {
        if (!cancelled) setFacultiesLoading(false);
      }
    }
    loadFaculties();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    apiJsonSafe<{ count?: number }>("/api/public/today-works", { count: 0 }).then((d) =>
      setTodayCount(typeof d.count === "number" ? d.count : 0)
    );
  }, []);

  const supervisorDepartments =
    faculties.find((f) => f.id === supervisorFacultyId)?.departments ?? [];

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok && !res?.error) {
      const session = await getSession();
      const role = session?.user?.role;
      const home =
        role === "ADMIN" ? "/admin"
        : role === "SUPERVISOR" ? "/supervisor"
        : "/dashboard";
      router.push(home);
      router.refresh();
      return;
    }
    const st = await fetch("/api/auth/login-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json() as Promise<{ status: string; message?: string }>);
    if (st.status === "pending" && st.message) setError("Өтініміңіз әлі қаралмады. Күте тұрыңыз.");
    else if (st.status === "rejected" && st.message) setError(st.message);
    else setError("Email немесе пароль қате");
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!facultiesLoading && faculties.length === 0) {
      setError("Факультеттер тізімі жоқ. Дерекқорды толтырыңыз немесе бетті жаңартыңыз.");
      setLoading(false);
      return;
    }
    try {
      const body =
        registerRole === "SUPERVISOR" ?
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: "SUPERVISOR" as const,
            departmentId,
            position: position.trim(),
            phone: phone.trim(),
            employeeId: employeeId.trim(),
          }
        : {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: "STUDENT" as const,
            facultyId: facultyId || "",
          };

      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const j = await r.json();
        throw new Error(j.error || "Қате");
      }
      const data = (await r.json()) as {
        success?: boolean;
        message?: string;
        redirect?: string | null;
        supervisorPending?: boolean;
      };
      if (data.message === "pending" || data.supervisorPending) {
        setSupervisorSubmitted(true);
        return;
      }
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) throw new Error("Кіру сәтсіз");
      const session = await getSession();
      const role = session?.user?.role;
      const home =
        role === "ADMIN" ? "/admin"
        : role === "SUPERVISOR" ? "/supervisor"
        : "/dashboard";
      router.push(home);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Қате");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <Logo href="/" variant="inverse" />
        </div>

        <div className="z-10">
          <p className="font-display italic text-4xl text-white max-w-md leading-tight mb-8">
            &ldquo;Білім — ең қымбат қазына, оны ешкім ұрлай алмайды.&rdquo;
          </p>

          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-xl">
            <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-white font-medium text-sm">
                Бүгін {todayCount ?? "—"} жаңа жұмыс жіберілді ✦
              </div>
              <div className="text-white/60 text-xs">Платформа белсенді дамуда</div>
            </div>
          </div>
        </div>

        <div className="text-white/40 text-xs z-10">
          © 2024 Task IN — Білімді бөліс. Болашақты жаса.
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24">
        <div className="max-w-[400px] w-full mx-auto">
          <div className="lg:hidden mb-12">
            <Logo href="/" />
          </div>

          <div className="flex gap-8 border-b border-neutral-100 mb-8">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setError(null);
              }}
              className={`pb-4 text-sm font-medium transition-all relative ${
                tab === "login" ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Кіру
              {tab === "login" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setError(null);
                setSupervisorSubmitted(false);
              }}
              className={`pb-4 text-sm font-medium transition-all relative ${
                tab === "register" ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Тіркелу
              {tab === "register" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          {tab === "login" ?
            <form onSubmit={onLogin} className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Қош келдіңіз</h1>
                <p className="text-sm text-neutral-500">Жұмысты жалғастыру үшін жүйеге кіріңіз</p>
              </div>
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Электрондық пошта
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Құпия сөз
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 text-white" size="lg" type="submit" disabled={loading}>
                Кіру
              </Button>
            </form>
          : supervisorSubmitted ?
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 space-y-3 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="text-lg font-semibold text-emerald-900">Өтінім жіберілді!</h2>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Сіздің тіркелу өтінімі әкімшіге жіберілді. Бекітілгеннен кейін email арқылы хабарланасыз.
              </p>
              <p className="text-xs text-emerald-700">Күту уақыты: 1-2 жұмыс күні</p>
              <Button
                type="button"
                variant="secondary"
                className="w-full mt-4"
                onClick={() => {
                  router.push("/");
                }}
              >
                Басты бетке оралу
              </Button>
            </div>
          : <form onSubmit={onRegister} className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Тіркелу</h1>
                <p className="text-sm text-neutral-500">Жаңа аккаунт жасаңыз</p>
              </div>
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              {facultiesError && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 space-y-2">
                  <p>{facultiesError}</p>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary underline"
                    onClick={() => window.location.reload()}
                  >
                    Бетті жаңарту
                  </button>
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Рөл</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterRole("STUDENT")}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        registerRole === "STUDENT" ? "border-blue-600 bg-blue-50 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">👨‍🎓</div>
                      <div className="font-semibold text-neutral-900">Студент</div>
                      <p className="text-xs text-neutral-500 mt-1">Бірден кіре аласыз</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole("SUPERVISOR")}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        registerRole === "SUPERVISOR" ? "border-blue-600 bg-blue-50 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">👨‍🏫</div>
                      <div className="font-semibold text-neutral-900">Жетекші</div>
                      <p className="text-xs text-neutral-500 mt-1">Өтінім жіберіледі</p>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Аты-жөні</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Электрондық пошта
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Құпия сөз</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>

                {registerRole === "STUDENT" ?
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Факультет</label>
                    <select
                      className="flex h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-60"
                      value={facultyId}
                      onChange={(e) => setFacultyId(e.target.value)}
                      required
                      disabled={facultiesLoading || faculties.length === 0}
                    >
                      <option value="">{facultiesLoading ? "Жүктелуде…" : "— Таңдаңыз —"}</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                : <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Факультет</label>
                      <select
                        className="flex h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-60"
                        value={supervisorFacultyId}
                        onChange={(e) => {
                          setSupervisorFacultyId(e.target.value);
                          setDepartmentId("");
                        }}
                        required
                        disabled={facultiesLoading || faculties.length === 0}
                      >
                        <option value="">{facultiesLoading ? "Жүктелуде…" : "Факультетті таңдаңыз"}</option>
                        {faculties.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Кафедра</label>
                      <select
                        className="flex h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-60"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                        disabled={facultiesLoading || !supervisorFacultyId}
                      >
                        <option value="">{supervisorFacultyId ? "— Кафедраны таңдаңыз —" : "Алдымен факультетті таңдаңыз"}</option>
                        {supervisorDepartments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Қызметі</label>
                      <Input
                        placeholder="Мысалы: Доцент, PhD"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Байланыс телефоны
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Куәлік нөмірі
                      </label>
                      <Input
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                      />
                    </div>
                  </>
                }
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                size="lg"
                type="submit"
                disabled={loading || facultiesLoading || faculties.length === 0}
              >
                {registerRole === "STUDENT" ? "Тіркелу және кіру →" : "Өтінім жіберу →"}
              </Button>
            </form>
          }
        </div>
      </div>
    </div>
  );
}
