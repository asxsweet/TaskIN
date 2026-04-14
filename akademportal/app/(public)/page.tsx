import Link from "next/link";
import { Search, Shield, Layers, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { WorkCard } from "@/components/works/WorkCard";
import { formatNumber } from "@/lib/utils";
import { getPublicLandingData } from "@/lib/public-landing";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { stats: s, recent, site } = await getPublicLandingData();
  const siteName = site?.siteName?.trim() || "Task IN";
  const tagline = site?.tagline?.trim() || "";

  return (
    <div className="min-h-screen bg-white">
      <Navbar site={site} />

      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-[55%] z-10">
              <div className="inline-flex items-center rounded-pill bg-primary-tint px-4 py-1.5 text-sm font-medium text-primary mb-8">
                ✦ {formatNumber(s.worksCount)} академиялық жұмыс жинақталды
              </div>

              <h1 className="font-display text-5xl lg:text-[64px] leading-[1.05] tracking-tight text-neutral-950 mb-4">
                {siteName}
              </h1>
              <p className="text-lg lg:text-xl text-neutral-600 max-w-[540px] mb-10 whitespace-pre-line">
                {tagline || "Университеттің дипломдық, курстық жұмыстары мен ғылыми мақалалары бір платформада."}
              </p>

              <div className="flex flex-wrap gap-4 mb-16">
                <Link href="/search">
                  <Button size="lg" className="gap-2">
                    Жұмыстарды шолу <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="secondary" size="lg">
                    Жүктеу
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-12">
                <div>
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none mb-1">
                    {formatNumber(s.worksCount)}
                  </div>
                  <div className="text-[13px] text-neutral-500 uppercase tracking-wider">Жұмыс</div>
                </div>
                <div className="h-10 w-px bg-neutral-200" />
                <div>
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none mb-1">
                    {formatNumber(s.usersCount)}
                  </div>
                  <div className="text-[13px] text-neutral-500 uppercase tracking-wider">Студент</div>
                </div>
                <div className="h-10 w-px bg-neutral-200" />
                <div>
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none mb-1">
                    {formatNumber(s.facultiesCount)}
                  </div>
                  <div className="text-[13px] text-neutral-500 uppercase tracking-wider">Факультет</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:w-[45%] relative h-[600px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]">
                {recent.length > 0 ?
                  recent.slice(0, 3).map((w, idx) => (
                    <div
                      key={w.id}
                      className={
                        idx === 0 ? "relative z-10 shadow-xl"
                        : idx === 1 ? "absolute inset-0 opacity-60 blur-[0.5px] -rotate-3"
                        : "absolute inset-0 opacity-30 blur-[1px] -rotate-6"
                      }
                    >
                      <WorkCard
                        id={w.id}
                        title={w.title}
                        authorName={w.authorName}
                        facultyName={w.facultyName}
                        supervisorName={w.supervisorName}
                        abstract={w.abstract}
                        type={w.type}
                        views={w.viewCount}
                        downloads={w.downloads}
                        year={w.year}
                        tags={w.keywords}
                        variant="vertical"
                      />
                    </div>
                  ))
                : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium text-neutral-900">Неліктен {siteName}?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="text-primary" />,
                title: "Лезде іздеу",
                desc: "Толық мәтіндік іздеу және сүзгілер",
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
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-lg border border-neutral-100 shadow-xs">
                <div className="h-12 w-12 rounded-md bg-primary-tint flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-semibold">Соңғы жұмыстар</h2>
            {recent.length > 0 ?
              <Link href="/search" className="text-primary font-medium hover:underline">
                Барлығын қарау →
              </Link>
            : null}
          </div>

          {recent.length === 0 ?
            <EmptyState title="Әлі жұмыстар жоқ" description="Студенттер жұмыс жүктегенде осында көрінеді." />
          : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recent.map((w) => (
                <WorkCard
                  key={w.id}
                  id={w.id}
                  title={w.title}
                  authorName={w.authorName}
                  facultyName={w.facultyName}
                  supervisorName={w.supervisorName}
                  abstract={w.abstract}
                  type={w.type}
                  views={w.viewCount}
                  downloads={w.downloads}
                  year={w.year}
                  tags={w.keywords}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-medium text-white mb-4">
            Жұмысыңызды {siteName} арқылы жүктеңіз
          </h2>
          <p className="text-white/80 text-lg mb-10">Тегін. Тез. Сенімді.</p>
          <Link href="/upload">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-neutral-50 border-none">
              Бастау →
            </Button>
          </Link>
        </div>
      </section>

      <Footer site={site} />
    </div>
  );
}
