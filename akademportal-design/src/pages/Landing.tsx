import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Search, Shield, Layers, ArrowRight } from "lucide-react";
import { Navbar } from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/Button";
import { WorkCard } from "@/src/components/WorkCard";

const MOCK_WORKS = [
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
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-[55%] z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-pill bg-primary-tint px-4 py-1.5 text-sm font-medium text-primary mb-8"
              >
                ✦ 1,284 академиялық жұмыс жинақталды
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-6xl lg:text-[72px] leading-[0.95] tracking-tight text-neutral-950 mb-8"
              >
                Білімді бөліс.<br />
                Болашақты жаса.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg lg:text-xl text-neutral-600 max-w-[540px] mb-10"
              >
                Университеттің барлық дипломдық, курстық жұмыстары мен ғылыми мақалалары бір платформада.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-16"
              >
                <Link to="/search">
                  <Button size="lg" className="gap-2">
                    Жұмыстарды шолу <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button variant="secondary" size="lg">Жүктеу</Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-12"
              >
                <div>
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none mb-1">1,284</div>
                  <div className="text-[13px] text-neutral-500 uppercase tracking-wider">Жұмыс</div>
                </div>
                <div className="h-10 w-px bg-neutral-200" />
                <div>
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none mb-1">856</div>
                  <div className="text-[13px] text-neutral-500 uppercase tracking-wider">Студент</div>
                </div>
                <div className="h-10 w-px bg-neutral-200" />
                <div>
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none mb-1">12</div>
                  <div className="text-[13px] text-neutral-500 uppercase tracking-wider">Факультет</div>
                </div>
              </motion.div>
            </div>

            {/* Stacked Cards Decoration */}
            <div className="hidden lg:block lg:w-[45%] relative h-[600px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]">
                <motion.div
                  initial={{ opacity: 0, rotate: -10, x: 50 }}
                  animate={{ opacity: 0.3, rotate: -6, x: 40 }}
                  className="absolute inset-0 blur-[1px]"
                >
                  <WorkCard {...MOCK_WORKS[2]} variant="vertical" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, rotate: -5, x: 30 }}
                  animate={{ opacity: 0.6, rotate: -3, x: 20 }}
                  className="absolute inset-0 blur-[0.5px]"
                >
                  <WorkCard {...MOCK_WORKS[1]} variant="vertical" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 shadow-xl"
                >
                  <WorkCard {...MOCK_WORKS[0]} variant="vertical" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium text-neutral-900">Неліктен АкадемПортал?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="text-primary" />,
                title: "Лезде іздеу",
                desc: "100,000 жұмыс ішінен 0.2 секундта нәтиже",
              },
              {
                icon: <Shield className="text-primary" />,
                title: "Верификацияланған",
                desc: "Жетекші мен кафедра бекітеді",
              },
              {
                icon: <Layers className="text-primary" />,
                title: "Реттелген каталог",
                desc: "Факультет/жыл/тіл бойынша сүзгі",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-lg border border-neutral-100 shadow-xs"
              >
                <div className="h-12 w-12 rounded-md bg-primary-tint flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-semibold">Соңғы жұмыстар</h2>
            <Link to="/search" className="text-primary font-medium hover:underline">
              Барлығын қарау →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_WORKS.map((work, i) => (
              <WorkCard key={i} {...work} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-medium text-white mb-4">
            Дипломдық жұмысыңызды бүгін жүктеңіз
          </h2>
          <p className="text-white/80 text-lg mb-10">Тегін. Тез. Сенімді.</p>
          <Link to="/upload">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-neutral-50 border-none">
              Бастау →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
                  А
                </div>
                <span className="text-sm font-semibold tracking-tight text-neutral-900">АкадемПортал</span>
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Университеттің академиялық жұмыстар репозиторийі. Білімді бөлісу арқылы болашақты бірге жасаймыз.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400">Сілтемелер</h4>
              <ul className="space-y-4 text-sm text-neutral-600">
                <li><Link to="/search" className="hover:text-primary">Іздеу</Link></li>
                <li><Link to="/upload" className="hover:text-primary">Жүктеу</Link></li>
                <li><Link to="/about" className="hover:text-primary">Жоба туралы</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400">Байланыс</h4>
              <ul className="space-y-4 text-sm text-neutral-600">
                <li>info@academportal.kz</li>
                <li>+7 (777) 123-45-67</li>
                <li>Алматы қ., Достық даңғылы, 123</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-neutral-400">Әлеуметтік желілер</h4>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white cursor-pointer transition-colors">
                  IG
                </div>
                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white cursor-pointer transition-colors">
                  FB
                </div>
                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white cursor-pointer transition-colors">
                  LI
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-400">
            © 2024 АкадемПортал. Барлық құқықтар қорғалған.
          </div>
        </div>
      </footer>
    </div>
  );
}
