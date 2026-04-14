import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<"login" | "register">(
    (searchParams.get("tab") as "login" | "register") || "login"
  );
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 text-white z-10">
          <div className="h-8 w-8 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
            А
          </div>
          <span className="text-sm font-semibold tracking-tight">АкадемПортал</span>
        </Link>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-display text-[240px] select-none">
          "
        </div>

        <div className="z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display italic text-4xl text-white max-w-md leading-tight mb-8"
          >
            "Білім — ең қымбат қазына, оны ешкім ұрлай алмайды."
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-xl"
          >
            <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Бүгін 12 жаңа жұмыс жіберілді ✦</div>
              <div className="text-white/60 text-xs">Платформа белсенді дамуда</div>
            </div>
          </motion.div>
        </div>

        <div className="text-white/40 text-xs z-10">
          © 2024 АкадемПортал — Университеттің академиялық жұмыстар репозиторийі
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24">
        <div className="max-w-[400px] w-full mx-auto">
          <div className="lg:hidden mb-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
                А
              </div>
              <span className="text-sm font-semibold tracking-tight text-neutral-900">АкадемПортал</span>
            </Link>
          </div>

          <div className="flex gap-8 border-b border-neutral-100 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeTab === "login" ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Кіру
              {activeTab === "login" && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeTab === "register" ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Тіркелу
              {activeTab === "register" && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Қош келдіңіз</h1>
                  <p className="text-sm text-neutral-500">Жұмысты жалғастыру үшін жүйеге кіріңіз</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Электрондық пошта</label>
                    <Input placeholder="name@university.edu" type="email" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Құпия сөз</label>
                      <button className="text-xs text-primary hover:underline">Ұмыттыңыз ба?</button>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded border-neutral-300 text-primary focus:ring-primary/25" />
                  <label htmlFor="remember" className="text-sm text-neutral-600">Мені есте сақта</label>
                </div>

                <Link to="/dashboard">
                  <Button className="w-full" size="lg">Кіру</Button>
                </Link>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-neutral-400">немесе</span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full gap-2" size="lg">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Google арқылы кіру
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Тіркелу</h1>
                  <p className="text-sm text-neutral-500">Жаңа аккаунт жасаңыз</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Аты</label>
                      <Input placeholder="Айдана" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Жөні</label>
                      <Input placeholder="Серік" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Электрондық пошта</label>
                    <Input placeholder="name@university.edu" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Құпия сөз</label>
                    <Input placeholder="••••••••" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Факультет</label>
                    <select className="flex h-[40px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 transition-all">
                      <option>АТ факультеті</option>
                      <option>Экономика</option>
                      <option>Математика</option>
                      <option>Филология</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Рөлі</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="role" className="text-primary focus:ring-primary/25" defaultChecked />
                        <span className="text-sm text-neutral-600">Студент</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="role" className="text-primary focus:ring-primary/25" />
                        <span className="text-sm text-neutral-600">Оқытушы</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary/25" />
                  <label htmlFor="terms" className="text-sm text-neutral-600 leading-tight">
                    Мен <button className="text-primary hover:underline">пайдалану шарттарымен</button> келісемін
                  </label>
                </div>

                <Link to="/dashboard">
                  <Button className="w-full" size="lg">Тіркелу</Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
