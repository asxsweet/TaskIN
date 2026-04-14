import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, Calendar, Landmark, Globe, BookOpen, Download, Bookmark, Share2, AlertCircle, FileText, Star } from "lucide-react";
import { Navbar } from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Avatar } from "@/src/components/ui/Avatar";
import { WorkCard } from "@/src/components/WorkCard";
import { ScoreRing } from "@/src/components/rating/ScoreRing";
import { CriteriaRow } from "@/src/components/rating/CriteriaRow";
import { PlagiarismBadge } from "@/src/components/rating/PlagiarismBadge";
import { ReviewCard } from "@/src/components/rating/ReviewCard";
import { StarRating } from "@/src/components/rating/StarRating";

const MOCK_WORK = {
  title: "Машиналық оқыту негізінде медициналық кескіндерді талдау жүйесін әзірлеу",
  author: "Айдана Серік",
  faculty: "АТ факультеті",
  supervisor: "Сейтқали А.М.",
  abstract: "Бұл жұмыста нейрондық желілерді қолдана отырып, рентген кескіндеріндегі патологияларды автоматты түрде анықтау әдістері қарастырылған. Зерттеу барысында 5000-нан астам кескін талданып, жүйенің дәлдігі 94%-ға жетті. Платформа медицина мамандарына диагноз қоюда көмекші құрал ретінде қызмет ете алады. Жұмыс аясында қолданылған алгоритмдер мен деректер жиынтығы толық сипатталған.",
  type: "Дипломдық жұмыс",
  status: "approved",
  views: 312,
  downloads: 94,
  date: "2024",
  pages: 156,
  lang: "Қазақша",
  tags: ["AI", "Medicine", "Python", "Deep Learning", "Healthcare"],
  chapters: [
    "Кіріспе",
    "Медициналық кескіндерді талдаудың заманауи әдістері",
    "Машиналық оқыту алгоритмдерін таңдау және негіздеу",
    "Жүйенің архитектурасы мен бағдарламалық іске асырылуы",
    "Эксперименттік зерттеулер мен нәтижелерді талдау",
    "Қорытынды",
    "Пайдаланылған әдебиеттер тізімі"
  ]
};

export default function WorkDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 lg:px-20 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-12">
          <Link to="/search" className="hover:text-primary transition-colors">Іздеу</Link>
          <ChevronRight size={14} />
          <Link to="/search?type=diploma" className="hover:text-primary transition-colors">Дипломдық жұмыстар</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 font-medium line-clamp-1">{MOCK_WORK.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="type">{MOCK_WORK.type}</Badge>
                <Badge variant="approved">Бекітілді</Badge>
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl text-neutral-900 leading-tight">
                {MOCK_WORK.title}
              </h1>

              <div className="flex items-center gap-4 py-4 border-y border-neutral-100">
                <Avatar initials="АС" size="lg" />
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-900">{MOCK_WORK.author}</span>
                  <span className="text-sm text-neutral-500">Ғылыми жетекші: {MOCK_WORK.supervisor}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-neutral-400" /> {MOCK_WORK.date}
                </div>
                <div className="flex items-center gap-2">
                  <Landmark size={16} className="text-neutral-400" /> {MOCK_WORK.faculty}
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-neutral-400" /> {MOCK_WORK.lang}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-neutral-400" /> {MOCK_WORK.pages} бет
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {MOCK_WORK.tags.map(tag => (
                  <Badge key={tag} variant="tag" className="px-3 py-1">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Аннотация</h3>
              <p className="text-neutral-700 leading-relaxed text-lg">
                {MOCK_WORK.abstract}
              </p>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="space-y-6">
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Мазмұны</h3>
              <ul className="space-y-4">
                {MOCK_WORK.chapters.map((chapter, i) => (
                  <li key={i} className="flex gap-4 group cursor-pointer">
                    <span className="text-neutral-300 font-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-neutral-700 group-hover:text-primary transition-colors">{chapter}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sidebar Sticky Card */}
          <aside className="lg:w-[360px]">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-neutral-200 rounded-xl shadow-md p-6 space-y-6">
                <div className="aspect-[3/4] bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-100 relative overflow-hidden group cursor-pointer">
                  <FileText size={64} className="text-neutral-200 group-hover:text-primary/20 transition-colors" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-3">
                  <Button className="w-full gap-2" size="lg">
                    <Download size={18} /> PDF жүктеу
                  </Button>
                  <Button variant="secondary" className="w-full gap-2" size="lg">
                    <Bookmark size={18} /> Жинаққа қосу
                  </Button>
                </div>

                <div className="h-px bg-neutral-100" />

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Академиялық бағалау</h4>
                  <div className="flex flex-col items-center gap-4">
                    <ScoreRing score={4.8} size={96} />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-semibold text-neutral-900">4.8 / 5.0</span>
                      <Badge variant="approved" className="bg-success-tint text-success border-none">Бекітілді</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <CriteriaRow label="Өзектілік" score={4.5} compact />
                    <CriteriaRow label="Әдістеме" score={4.8} compact />
                    <CriteriaRow label="Ресімдеу" score={4.3} compact />
                    <CriteriaRow label="Қорытынды" score={4.7} compact />
                  </div>

                  <div className="flex justify-center pt-2">
                    <PlagiarismBadge percentage={87} />
                  </div>

                  <Button variant="ghost" className="w-full text-xs text-neutral-500 hover:text-primary" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>
                    Барлық пікірлерді қарау
                  </Button>
                </div>

                <div className="h-px bg-neutral-100" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-neutral-900">{MOCK_WORK.views}</div>
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Қаралым</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900">{MOCK_WORK.downloads}</div>
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Жүктеу</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900 flex items-center justify-center gap-1">
                      4.8 <Star size={14} className="fill-warning text-warning" />
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Рейтинг</div>
                  </div>
                </div>

                <div className="h-px bg-neutral-100" />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors">
                      <Share2 size={16} />
                    </button>
                    <button className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors">
                      <Bookmark size={16} />
                    </button>
                  </div>
                  <button className="text-xs text-neutral-400 hover:text-danger flex items-center gap-1 transition-colors">
                    <AlertCircle size={14} /> Мазмұнды хабарлау
                  </button>
                </div>
              </div>

              <div className="bg-primary-tint rounded-xl p-6 border border-primary/10">
                <h4 className="text-sm font-semibold text-primary mb-2">Ғылыми жетекші пікірі</h4>
                <p className="text-xs text-primary/70 leading-relaxed italic">
                  "Жұмыс өте жоғары деңгейде орындалған. Автор тақырыпты толық ашып, практикалық маңызы бар нәтижелерге қол жеткізген."
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Evaluations and Reviews */}
        <section id="reviews" className="mt-32 pt-16 border-t border-neutral-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-neutral-900">Бағалаулар мен пікірлер</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-display text-neutral-900">4.8</span>
                <StarRating rating={4.8} size="md" count={12} />
              </div>
            </div>
            <Button className="md:w-fit">Пікір қалдыру</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Breakdown */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs h-fit space-y-8">
              <div className="flex items-center gap-6">
                <ScoreRing score={4.8} size={96} />
                <div className="flex flex-col">
                  <span className="font-display text-5xl text-neutral-900">4.8</span>
                  <span className="text-sm text-neutral-500">12 баға негізінде</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { stars: 5, count: 8, total: 12 },
                  { stars: 4, count: 3, total: 12 },
                  { stars: 3, count: 1, total: 12 },
                  { stars: 2, count: 0, total: 12 },
                  { stars: 1, count: 0, total: 12 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-600 w-4">{row.stars}★</span>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(row.count / row.total) * 100}%` }}
                        className="h-full bg-warning rounded-full"
                      />
                    </div>
                    <span className="text-xs text-neutral-400 w-4 text-right">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {[
                {
                  reviewer: { name: "Сейтқали А.М.", role: "Ғылыми жетекші" },
                  date: "15.03.2024",
                  rating: 4.9,
                  comment: "Жұмыс өте жоғары деңгейде орындалған. Автор машиналық оқыту алгоритмдерін медициналық кескіндерге қолдануда терең білім көрсетті. Тәжірибелік бөлімде алынған нәтижелер нақты деректермен расталған. Ресімдеу талаптары толық сақталған.",
                  criteria: [
                    { label: "Өзектілік", score: 5.0 },
                    { label: "Әдістеме", score: 4.8 },
                    { label: "Ресімдеу", score: 4.9 },
                    { label: "Қорытынды", score: 5.0 },
                  ],
                  helpfulCount: 12,
                  unhelpfulCount: 0
                },
                {
                  reviewer: { name: "Исаев Д.С.", role: "Рецензент" },
                  date: "12.03.2024",
                  rating: 4.7,
                  comment: "Зерттеу тақырыбы бүгінгі таңда өте өзекті. Жүйенің архитектурасы дұрыс құрылған. Дегенмен, болашақта деректер жиынтығын әлі де кеңейту ұсынылады. Жалпы алғанда, жұмыс дипломдық жоба талаптарына толық жауап береді.",
                  criteria: [
                    { label: "Өзектілік", score: 4.8 },
                    { label: "Әдістеме", score: 4.5 },
                    { label: "Ресімдеу", score: 4.7 },
                    { label: "Қорытынды", score: 4.8 },
                  ],
                  helpfulCount: 8,
                  unhelpfulCount: 1
                }
              ].map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
              <Button variant="secondary" className="w-full">Тағы қарау</Button>
            </div>
          </div>
        </section>

        {/* Similar Works */}
        <section className="mt-32 pt-16 border-t border-neutral-100">
          <h2 className="text-2xl font-semibold mb-12">Ұқсас жұмыстар</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Денсаулық сақтау жүйесіндегі жасанды интеллект",
                author: "Марат Әли",
                faculty: "АТ факультеті",
                supervisor: "Исаев Д.С.",
                abstract: "Жасанды интеллект технологияларының медициналық диагностикадағы тиімділігі мен болашақ даму бағыттары қарастырылған...",
                type: "Ғылыми мақала",
                views: 145,
                downloads: 28,
                date: "2024",
                tags: ["AI", "Medicine"],
              },
              {
                title: "Медициналық деректерді қорғаудың криптографиялық әдістері",
                author: "Сара Қанат",
                faculty: "АТ факультеті",
                supervisor: "Ахметов Қ.Т.",
                abstract: "Пациенттердің жеке деректерін шифрлау және қауіпсіз сақтау алгоритмдерінің салыстырмалы талдауы жүргізілді...",
                type: "Дипломдық жұмыс",
                views: 92,
                downloads: 15,
                date: "2023",
                tags: ["Security", "Medicine"],
              },
              {
                title: "Нейрондық желілерді кескіндерді сегментациялауда қолдану",
                author: "Арман Серік",
                faculty: "АТ факультеті",
                supervisor: "Сейтқали А.М.",
                abstract: "U-Net архитектурасын қолдана отырып, медициналық кескіндердегі ағзаларды автоматты сегментациялау әдісі ұсынылған...",
                type: "Курстық жұмыс",
                views: 178,
                downloads: 42,
                date: "2024",
                tags: ["Deep Learning", "CV"],
              },
            ].map((work, i) => (
              <WorkCard key={i} {...work} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
