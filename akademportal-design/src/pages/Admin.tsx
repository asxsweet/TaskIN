import * as React from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, FileText, Users, Clock, Landmark, 
  BarChart3, TrendingUp, TrendingDown, Check, X, 
  ExternalLink, Search, Bell, Settings, LogOut, Star, Award, UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNav } from "@/src/components/MobileNav";
import { Avatar } from "@/src/components/ui/Avatar";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { ScoreRing } from "@/src/components/rating/ScoreRing";
import { CriteriaRow } from "@/src/components/rating/CriteriaRow";
import { StarRating } from "@/src/components/rating/StarRating";
import { ReviewFormModal } from "@/src/components/rating/ReviewFormModal";
import { cn } from "@/src/lib/utils";

export default function Admin() {
  const [activeTab, setActiveTab] = React.useState("Шолу");
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [selectedWork, setSelectedWork] = React.useState({ title: "", author: "" });

  const handleOpenReview = (work: { title: string; author: string }) => {
    setSelectedWork(work);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (data: any) => {
    console.log("Review submitted:", data);
    // In a real app, this would send an email and update the DB
    alert("Бағалау жіберілді ✓ Студентке хабарлама жіберілді.");
  };
  return (
    <div className="flex min-h-screen bg-neutral-50 pb-20 md:pb-0">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-[240px] border-r border-neutral-200 bg-white flex-col h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
              А
            </div>
            <span className="text-sm font-semibold tracking-tight text-neutral-900">АкадемПортал</span>
          </Link>
        </div>

        <div className="flex-1 px-3 space-y-8 overflow-y-auto">
          <div>
            <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">Басқару</h4>
            <div className="space-y-1">
              {[
                { label: "Шолу", icon: LayoutDashboard },
                { label: "Жұмыстар", icon: FileText },
                { label: "Бағалаулар", icon: Star },
                { label: "Пайдаланушылар", icon: Users },
                { label: "Тексеру кезегі", icon: Clock, badge: 23 },
                { label: "Факультеттер", icon: Landmark },
                { label: "Есептер", icon: BarChart3 },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all group",
                    activeTab === item.label 
                      ? "bg-primary-tint text-primary border-l-2 border-primary" 
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={cn(activeTab === item.label ? "text-primary" : "text-neutral-400 group-hover:text-neutral-600")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <div className="bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 p-2">
            <Avatar initials="АМ" size="sm" className="bg-neutral-900 text-white" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-900">Админ</span>
              <span className="text-[10px] text-neutral-400">admin@university.edu</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Admin Topbar */}
        <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>Админ панель</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-medium">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input placeholder="Іздеу..." className="pl-10 h-8 bg-neutral-50 border-none text-xs" />
            </div>
            <button className="text-neutral-400 hover:text-neutral-600"><Bell size={18} /></button>
            <button className="text-neutral-400 hover:text-neutral-600"><Settings size={18} /></button>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-8">
          {activeTab === "Шолу" && (
            <>
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "Барлық жұмыстар", value: "1,284", trend: "+12", up: true },
                  { label: "Студенттер", value: "856", trend: "+5", up: true },
                  { label: "Бүгін жүктелді", value: "+7", trend: "2", up: false },
                  { label: "Тексеруде", value: "23", trend: "-4", up: true },
                  { label: "Айлық жүктеу", value: "3,921", trend: "+18%", up: true },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">{kpi.label}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-neutral-900">{kpi.value}</div>
                      <div className={cn(
                        "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded",
                        kpi.up ? "bg-success-tint text-success" : "bg-danger-tint text-danger"
                      )}>
                        {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {kpi.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Charts Placeholder */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
                  <h3 className="text-sm font-bold text-neutral-900 mb-6">Факультет бойынша жұмыстар</h3>
                  <div className="space-y-4">
                    {[
                      { label: "АТ факультеті", value: 321, total: 400 },
                      { label: "Экономика", value: 218, total: 400 },
                      { label: "Математика", value: 176, total: 400 },
                      { label: "Филология", value: 154, total: 400 },
                      { label: "Педагогика", value: 143, total: 400 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-600">{item.label}</span>
                          <span className="font-bold text-neutral-900">{item.value}</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.total) * 100}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs flex flex-col">
                  <h3 className="text-sm font-bold text-neutral-900 mb-6">Жұмыс түрлері</h3>
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="h-40 w-40 rounded-full border-[12px] border-neutral-100 relative">
                      <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-r-transparent rotate-45" />
                      <div className="absolute inset-0 rounded-full border-[12px] border-success border-l-transparent border-b-transparent -rotate-12" />
                    </div>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold">1.2k</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Жалпы</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-xs text-neutral-600">Дипломдық (45%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span className="text-xs text-neutral-600">Мақала (30%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Table */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">Тексеру кезегі</h3>
                  <Button variant="ghost" size="sm">Барлығын қарау</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border-b border-neutral-100">
                        <th className="px-6 py-4">Тақырып</th>
                        <th className="px-6 py-4">Автор</th>
                        <th className="px-6 py-4">Факультет</th>
                        <th className="px-6 py-4">Жіберілген</th>
                        <th className="px-6 py-4">Файл</th>
                        <th className="px-6 py-4 text-right">Әрекет</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { title: "Киберқауіпсіздік трендтері...", author: "Ержан Мұрат", faculty: "АТ факультеті", time: "2 сағат бұрын" },
                        { title: "Инновациялық технологиялар...", author: "Гүлназ Әли", faculty: "Филология", time: "5 сағат бұрын" },
                        { title: "Big Data оңтайландыру...", author: "Тимур Исаев", faculty: "АТ факультеті", time: "Кеше" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-neutral-900 max-w-xs truncate">{row.title}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Avatar initials={row.author.split(" ").map(n => n[0]).join("")} size="sm" />
                              <span>{row.author}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-neutral-500">{row.faculty}</td>
                          <td className="px-6 py-4 text-neutral-400">{row.time}</td>
                          <td className="px-6 py-4">
                            <button className="text-primary hover:underline flex items-center gap-1">
                              <ExternalLink size={14} /> PDF
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenReview({ title: row.title, author: row.author })}
                                className="h-8 w-8 rounded bg-success-tint text-success flex items-center justify-center hover:bg-success hover:text-white transition-all"
                              >
                                <Check size={16} />
                              </button>
                              <button className="h-8 w-8 rounded bg-danger-tint text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "Бағалаулар" && (
            <div className="space-y-8">
              {/* Top Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Бағаланған", value: "1,047", icon: Check, color: "text-success" },
                  { label: "Орташа балл", value: "4.2", icon: Star, color: "text-warning" },
                  { label: "Тексеруде", value: "23", icon: Clock, color: "text-primary" },
                  { label: "Бұл ай", value: "+89", icon: TrendingUp, color: "text-success" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</div>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">Үздік жұмыстар</h3>
                  <div className="flex gap-2">
                    <select className="text-xs border border-neutral-200 rounded px-2 py-1 bg-neutral-50 focus:outline-none">
                      <option>АТ факультеті</option>
                      <option>Экономика</option>
                    </select>
                    <select className="text-xs border border-neutral-200 rounded px-2 py-1 bg-neutral-50 focus:outline-none">
                      <option>2024</option>
                      <option>2023</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border-b border-neutral-100">
                        <th className="px-6 py-4">Орын</th>
                        <th className="px-6 py-4">Тақырып</th>
                        <th className="px-6 py-4">Автор</th>
                        <th className="px-6 py-4">Факультет</th>
                        <th className="px-6 py-4">Балл</th>
                        <th className="px-6 py-4">Жүктеу</th>
                        <th className="px-6 py-4 text-right">Әрекет</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { rank: 1, title: "Машиналық оқыту негізінде медициналық кескіндерді талдау...", author: "Айдана Серік", faculty: "АТ факультеті", score: 4.9, downloads: 124 },
                        { rank: 2, title: "Қазақстанның жасыл экономикаға көшуінің экономикалық...", author: "Марат Әли", faculty: "Экономика", score: 4.8, downloads: 98 },
                        { rank: 3, title: "Блокчейн технологиясын білім беру саласында қолдану...", author: "Сара Қанат", faculty: "АТ факультеті", score: 4.7, downloads: 86 },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                              row.rank === 1 ? "bg-warning text-white" : row.rank === 2 ? "bg-neutral-300 text-white" : "bg-orange-300 text-white"
                            )}>
                              {row.rank}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-neutral-900 max-w-xs truncate">{row.title}</td>
                          <td className="px-6 py-4 text-neutral-600">{row.author}</td>
                          <td className="px-6 py-4 text-neutral-500">{row.faculty}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <ScoreRing score={row.score} size={32} strokeWidth={3} />
                              <span className="font-bold">{row.score}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-neutral-400">{row.downloads}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="outline" size="sm" className="text-warning border-warning hover:bg-warning hover:text-white gap-1.5">
                              <Award size={14} /> Дипломды беру
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reviewer Workload */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
                  <h3 className="text-sm font-bold text-neutral-900 mb-6">Жетекшілер белсенділігі</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                          <th className="pb-4">Жетекші</th>
                          <th className="pb-4">Тағайындалды</th>
                          <th className="pb-4">Аяқталды</th>
                          <th className="pb-4">Орташа балл</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {[
                          { name: "Сейтқали А.М.", assigned: 12, completed: 10, score: 4.8 },
                          { name: "Исаев Д.С.", assigned: 8, completed: 8, score: 4.5 },
                          { name: "Ахметов Қ.Т.", assigned: 15, completed: 12, score: 4.2 },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-neutral-50 last:border-0">
                            <td className="py-3 font-medium text-neutral-900">{row.name}</td>
                            <td className="py-3 text-neutral-600">{row.assigned}</td>
                            <td className="py-3 text-success font-bold">{row.completed}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5">
                                <Star size={12} className="fill-warning text-warning" />
                                <span className="font-bold">{row.score}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pending Queue */}
                <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
                  <h3 className="text-sm font-bold text-neutral-900 mb-6">Тағайындау кезегі</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Киберқауіпсіздік трендтері...", date: "2 сағат бұрын" },
                      { title: "Инновациялық технологиялар...", date: "5 сағат бұрын" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-neutral-900 max-w-[200px] truncate">{row.title}</span>
                          <span className="text-[10px] text-neutral-400 mt-1">{row.date}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 text-[11px] gap-1.5"
                          onClick={() => handleOpenReview({ title: row.title, author: "Студент" })}
                        >
                          <UserCheck size={14} /> Тағайындау
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criteria Analytics */}
              <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-neutral-900">Критерийлер бойынша орташа көрсеткіш</h3>
                  <div className="flex gap-2">
                    {["АТ", "Экономика", "Математика"].map(f => (
                      <Badge key={f} variant="tag" className="cursor-pointer hover:bg-primary-tint hover:text-primary transition-colors">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    { label: "Өзектілік", score: 4.6 },
                    { label: "Әдістеме", score: 4.2 },
                    { label: "Ресімдеу", score: 4.4 },
                    { label: "Қорытынды", score: 4.5 },
                  ].map((item, i) => (
                    <CriteriaRow key={i} label={item.label} score={item.score} delay={i * 0.1} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <MobileNav />

      <ReviewFormModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        work={selectedWork}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
