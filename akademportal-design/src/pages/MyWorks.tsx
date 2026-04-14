import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Plus, MoreVertical, FileText, Eye, Download, Calendar, AlertCircle, Clock } from "lucide-react";
import { Sidebar } from "@/src/components/Sidebar";
import { Topbar } from "@/src/components/Topbar";
import { MobileNav } from "@/src/components/MobileNav";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { ScoreRing } from "@/src/components/rating/ScoreRing";
import { CriteriaRow } from "@/src/components/rating/CriteriaRow";
import { PlagiarismBadge } from "@/src/components/rating/PlagiarismBadge";

export default function MyWorks() {
  return (
    <div className="flex min-h-screen bg-neutral-50 pb-20 md:pb-0">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="p-4 md:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">Менің жұмыстарым</h1>
            <Link to="/upload">
              <Button className="gap-2">
                <Plus size={18} /> Жаңа жүктеу
              </Button>
            </Link>
          </div>

          {/* Summary Strip */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-wrap items-center gap-4 md:gap-8 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Барлығы:</span>
              <span className="font-bold text-neutral-900">3</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Бекітілді:</span>
              <span className="font-bold text-success">2</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">Жалпы жүктелу:</span>
              <span className="font-bold text-neutral-900">94</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 md:gap-8 border-b border-neutral-200 overflow-x-auto whitespace-nowrap">
            {["Барлығы (3)", "Бекітілді (2)", "Тексеруде (1)", "Қабылданбады (0)"].map((tab, i) => (
              <button
                key={tab}
                className={`pb-4 text-sm font-medium transition-all relative ${
                  i === 0 ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {tab}
                {i === 0 && (
                  <motion.div layoutId="my-works-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Work List */}
          <div className="space-y-4">
            {[
              {
                title: "Машиналық оқыту негізінде медициналық кескіндерді талдау жүйесін әзірлеу",
                type: "Дипломдық жұмыс",
                status: "approved",
                views: 312,
                downloads: 94,
                date: "12.03.2024",
                tags: ["AI", "Medicine"],
              },
              {
                title: "Қазақстанның жасыл экономикаға көшуінің экономикалық тиімділігі",
                type: "Ғылыми мақала",
                status: "approved",
                views: 156,
                downloads: 42,
                date: "10.02.2024",
                tags: ["Economy", "Green Energy"],
              },
              {
                title: "Блокчейн технологиясын білім беру саласында қолдану мүмкіндіктері",
                type: "Дипломдық жұмыс",
                status: "pending",
                views: 0,
                downloads: 0,
                date: "05.04.2024",
                tags: ["Blockchain", "Education"],
              },
            ].map((work, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden group">
                <div className="p-6 flex gap-6">
                  <div className="h-24 w-20 bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center text-neutral-200 shrink-0">
                    <FileText size={32} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="type">{work.type}</Badge>
                      <Badge variant={work.status === "approved" ? "approved" : "pending"}>
                        {work.status === "approved" ? "Бекітілді" : "Тексеруде"}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary transition-colors truncate">
                      {work.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><Eye size={14} /> {work.views}</span>
                      <span className="flex items-center gap-1"><Download size={14} /> {work.downloads}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {work.date}</span>
                    </div>

                    <div className="flex gap-1.5">
                      {work.tags.map(tag => <Badge key={tag} variant="tag">{tag}</Badge>)}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end shrink-0">
                    <button className="text-neutral-400 hover:text-neutral-600 p-1">
                      <MoreVertical size={20} />
                    </button>
                    <Button variant="ghost" size="sm">PDF қарау</Button>
                  </div>
                </div>

                {work.status === "pending" && (
                  <div className="bg-warning-tint/30 border-t border-warning/10 px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-warning font-medium">
                      <Clock size={14} /> Бағалауды күтуде — жетекші: Сейтқали А.М.
                    </div>
                    <PlagiarismBadge percentage={76} className="scale-90" />
                  </div>
                )}

                {work.status === "approved" && (
                  <div className="border-t border-neutral-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <ScoreRing score={4.8} size={40} strokeWidth={4} />
                        <span className="text-sm font-bold text-neutral-900">4.8</span>
                      </div>
                      <div className="hidden md:flex gap-4">
                        <CriteriaRow label="Өзектілік" score={4.5} compact className="w-24" />
                        <CriteriaRow label="Әдістеме" score={4.8} compact className="w-24" />
                        <CriteriaRow label="Ресімдеу" score={4.3} compact className="w-24" />
                        <CriteriaRow label="Қорытынды" score={4.7} compact className="w-24" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <PlagiarismBadge percentage={87} className="scale-90" />
                      <Link to={`/work/${i}`} className="text-xs font-semibold text-success hover:underline">
                        Толық бағалауды қарау
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
