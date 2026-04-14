import * as React from "react";
import { motion } from "motion/react";
import { Search as SearchIcon, X, ChevronDown, Filter } from "lucide-react";
import { Sidebar } from "@/src/components/Sidebar";
import { Topbar } from "@/src/components/Topbar";
import { MobileNav } from "@/src/components/MobileNav";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Input } from "@/src/components/ui/Input";
import { WorkCard } from "@/src/components/WorkCard";

const MOCK_RESULTS = [
  {
    title: "Машиналық оқыту негізінде медициналық кескіндерді талдау жүйесін әзірлеу",
    author: "Айдана Серік",
    faculty: "АТ факультеті",
    supervisor: "Сейтқали А.М.",
    abstract: "Бұл жұмыста нейрондық желілерді қолдана отырып, рентген кескіндеріндегі патологияларды автоматты түрде анықтау әдістері қарастырылған...",
    type: "Дипломдық жұмыс",
    views: 312,
    downloads: 94,
    date: "2024",
    tags: ["AI", "Medicine", "Python"],
  },
  {
    title: "Қазақстанның жасыл экономикаға көшуінің экономикалық тиімділігі",
    author: "Бауыржан Қанат",
    faculty: "Экономика",
    supervisor: "Жүнісов Б.Қ.",
    abstract: "Зерттеу барысында жаңартылатын энергия көздерінің ел экономикасына әсері мен болашақ даму перспективалары талданды...",
    type: "Ғылыми мақала",
    views: 156,
    downloads: 42,
    date: "2023",
    tags: ["Economy", "Green Energy"],
  },
  {
    title: "Блокчейн технологиясын білім беру саласында қолдану мүмкіндіктері",
    author: "Меруерт Әли",
    faculty: "АТ факультеті",
    supervisor: "Исаев Д.С.",
    abstract: "Дипломдық жұмыс аясында студенттердің жетістіктерін верификациялауға арналған блокчейн негізіндегі платформа прототипі жасалды...",
    type: "Дипломдық жұмыс",
    views: 245,
    downloads: 68,
    date: "2024",
    tags: ["Blockchain", "Education"],
  },
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
];

export default function Search() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex min-h-screen bg-white pb-20 md:pb-0">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        {/* Search Header */}
        <div className="px-4 md:px-8 py-6 border-b border-neutral-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
              1,284 жұмыс табылды
            </h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              Сұрыптау: 
              <button className="flex items-center gap-1 font-medium text-neutral-900 hover:text-primary transition-colors">
                Релеванттылық <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input 
                placeholder="Тақырып, автор, кілт сөз..." 
                className="pl-12 h-12 text-base shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <Button size="lg" className="px-8">Іздеу</Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-14 z-30 bg-white border-b border-neutral-100 px-4 md:px-8 py-3 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Button variant="secondary" size="sm" className="gap-2 shrink-0">
              <Filter size={14} /> Сүзгілер <Badge variant="tag" className="bg-primary text-white ml-1">2</Badge>
            </Button>
            <div className="h-6 w-px bg-neutral-200 mx-2 shrink-0" />
            <div className="flex gap-2">
              <Badge variant="type" className="gap-1 pr-1 cursor-pointer hover:bg-primary-tint/80 shrink-0">
                АТ факультеті <X size={12} />
              </Badge>
              <Badge variant="type" className="gap-1 pr-1 cursor-pointer hover:bg-primary-tint/80 shrink-0">
                2024 <X size={12} />
              </Badge>
              <button className="text-[11px] font-medium text-danger hover:underline ml-2 shrink-0">Сүзгіні тазалау</button>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Filter Panel */}
          <aside className="w-[260px] border-r border-neutral-100 p-8 space-y-8 hidden lg:block">
            <div>
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">Жұмыс түрі</h4>
              <div className="space-y-3">
                {[
                  { label: "Дипломдық жұмыс", count: 486, checked: true },
                  { label: "Курстық жұмыс", count: 312 },
                  { label: "Ғылыми мақала", count: 198 },
                  { label: "Эссе", count: 156 },
                  { label: "Жоба", count: 132 },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={item.checked} className="rounded border-neutral-300 text-primary focus:ring-primary/25" />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{item.label}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">Факультет</h4>
              <div className="space-y-3">
                {[
                  { label: "АТ факультеті", count: 321, checked: true },
                  { label: "Экономика", count: 218 },
                  { label: "Математика", count: 176 },
                  { label: "Педагогика", count: 143 },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={item.checked} className="rounded border-neutral-300 text-primary focus:ring-primary/25" />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{item.label}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">{item.count}</span>
                  </label>
                ))}
                <button className="text-xs text-primary font-medium hover:underline">Тағы 8 көрсету</button>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">Жыл</h4>
              <div className="px-2">
                <div className="h-1 w-full bg-neutral-100 rounded-full relative mb-4">
                  <div className="absolute left-[20%] right-[10%] h-full bg-primary rounded-full" />
                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 h-3 w-3 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer" />
                  <div className="absolute right-[10%] top-1/2 -translate-y-1/2 h-3 w-3 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer" />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>2018</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">Тіл</h4>
              <div className="flex flex-wrap gap-2">
                {["Қазақша", "Орысша", "Ағылшынша"].map((lang) => (
                  <button key={lang} className="px-3 py-1.5 rounded-pill border border-neutral-200 text-[11px] font-medium hover:border-primary hover:text-primary transition-all">
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full mt-8">Қолдану</Button>
          </aside>

          {/* Results Area */}
          <main className="flex-1 p-4 md:p-8 bg-neutral-50">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {MOCK_RESULTS.map((work, i) => (
                <WorkCard key={i} {...work} />
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
              <Button variant="secondary" size="lg" className="px-12">Тағы жүктеу</Button>
              
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-400 hover:bg-white transition-colors">←</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-white font-medium">1</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-white transition-colors">2</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-white transition-colors">3</button>
                <span className="text-neutral-400">...</span>
                <button className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-white transition-colors">12</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 text-neutral-400 hover:bg-white transition-colors">→</button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
