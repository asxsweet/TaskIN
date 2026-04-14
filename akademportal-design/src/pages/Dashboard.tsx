import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FileText, Download, Eye, Star, ArrowUpRight, TrendingUp } from "lucide-react";
import { Sidebar } from "@/src/components/Sidebar";
import { Topbar } from "@/src/components/Topbar";
import { MobileNav } from "@/src/components/MobileNav";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { WorkCard } from "@/src/components/WorkCard";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-neutral-50 pb-20 md:pb-0">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="p-4 md:p-8 space-y-8">
          {/* Welcome Banner */}
          <section className="bg-primary rounded-xl p-8 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
              <div className="text-white">
                <h1 className="text-2xl font-semibold mb-2">Қайта оралдыңыз, Айдана! 👋</h1>
                <p className="text-white/70 text-sm max-w-md">
                  Сіздің жұмыстарыңызды бүгін 12 адам қарады. Жаңа жетістіктерге жете беріңіз!
                </p>
              </div>
              <Link to="/upload">
                <Button variant="secondary" className="bg-white text-primary border-none hover:bg-neutral-50">
                  Жаңа жүктеу <ArrowUpRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Жүктелген жұмыстарым", value: "3", icon: FileText, trend: "+1", trendColor: "text-success" },
              { label: "Жалпы жүктелулер", value: "94", icon: Download, trend: "+12", trendColor: "text-success" },
              { label: "Қаралымдар", value: "312", icon: Eye, trend: "+45", trendColor: "text-success" },
              { label: "Рейтинг", value: "4.8★", icon: Star, trend: "0.2", trendColor: "text-success" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon size={18} className="text-neutral-300" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendColor} bg-success-tint px-1.5 py-0.5 rounded`}>
                    <TrendingUp size={12} /> {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Works Table */}
            <section className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Соңғы жұмыстар</h2>
                <Link to="/my-works" className="text-sm text-primary hover:underline">Барлығын қарау</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                      <th className="pb-4 font-bold">Тақырып</th>
                      <th className="pb-4 font-bold">Түрі</th>
                      <th className="pb-4 font-bold">Статус</th>
                      <th className="pb-4 font-bold">Күні</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { title: "Машиналық оқыту негізінде...", type: "Дипломдық", status: "approved", date: "12.03.2024" },
                      { title: "Қазақстанның жасыл экономикасы", type: "Мақала", status: "approved", date: "10.02.2024" },
                      { title: "Блокчейн технологиясы...", type: "Дипломдық", status: "pending", date: "05.04.2024" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-neutral-50 last:border-0 group hover:bg-neutral-50 transition-colors">
                        <td className="py-4 font-medium text-neutral-900 group-hover:text-primary transition-colors cursor-pointer">{row.title}</td>
                        <td className="py-4 text-neutral-500">{row.type}</td>
                        <td className="py-4">
                          <Badge variant={row.status === "approved" ? "approved" : "pending"}>
                            {row.status === "approved" ? "Бекітілді" : "Тексеруде"}
                          </Badge>
                        </td>
                        <td className="py-4 text-neutral-400">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Activity Chart Placeholder */}
            <section className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6">
              <h2 className="text-lg font-semibold mb-6">Белсенділік</h2>
              <div className="h-48 flex items-end gap-2 mb-6">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary-tint rounded-t-sm relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm group-hover:bg-primary/80 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                <span>Дүй</span>
                <span>Сей</span>
                <span>Сәр</span>
                <span>Бей</span>
                <span>Жұм</span>
                <span>Сен</span>
                <span>Жек</span>
              </div>
            </section>
          </div>

          {/* Recommended Works */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ұсынылатын жұмыстар</h2>
              <Link to="/search" className="text-sm text-primary hover:underline">Барлығы →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Киберқауіпсіздік саласындағы заманауи трендтер",
                  author: "Ержан Мұрат",
                  faculty: "АТ факультеті",
                  supervisor: "Ахметов Қ.Т.",
                  abstract: "Мақалада соңғы жылдардағы кибершабуылдардың түрлері мен олардан қорғанудың жаңа әдістері талданған...",
                  type: "Ғылыми мақала",
                  views: 128,
                  downloads: 34,
                  date: "2024",
                  tags: ["Security", "IT"],
                },
                {
                  title: "Қазақ тілін оқытудағы инновациялық технологиялар",
                  author: "Гүлназ Әли",
                  faculty: "Филология",
                  supervisor: "Оспанова М.С.",
                  abstract: "Зерттеу жұмысы қазақ тілін шет тілі ретінде оқытудағы мобильді қосымшалардың тиімділігін анықтауға бағытталған...",
                  type: "Курстық жұмыс",
                  views: 89,
                  downloads: 12,
                  date: "2024",
                  tags: ["Education", "Language"],
                },
                {
                  title: "Қалалық инфрақұрылымды оңтайландырудағы Big Data",
                  author: "Тимур Исаев",
                  faculty: "АТ факультеті",
                  supervisor: "Смағұлов А.Б.",
                  abstract: "Үлкен деректерді талдау арқылы қалалық көлік қозғалысын реттеу және кептелістерді азайту жолдары қарастырылды...",
                  type: "Дипломдық жұмыс",
                  views: 210,
                  downloads: 56,
                  date: "2023",
                  tags: ["Big Data", "Smart City"],
                },
              ].map((work, i) => (
                <WorkCard key={i} {...work} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
