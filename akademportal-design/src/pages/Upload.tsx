import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { CloudUpload, FileText, X, Check, ArrowRight, ArrowLeft, Info } from "lucide-react";
import { Navbar } from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Badge } from "@/src/components/ui/Badge";

export default function Upload() {
  const [step, setStep] = React.useState(1);
  const [file, setFile] = React.useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + " MB" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-16">
          {[
            { n: 1, label: "Файл" },
            { n: 2, label: "Мәліметтер" },
            { n: 3, label: "Тексеру" },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-2 relative">
                <div 
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.n ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {step > s.n ? <Check size={20} /> : s.n}
                </div>
                <span className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap ${
                  step >= s.n ? "text-primary" : "text-neutral-400"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`h-0.5 w-24 mx-4 transition-all ${
                  step > s.n ? "bg-primary" : "bg-neutral-100"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">Жұмысты жүктеу</h1>
                <p className="text-neutral-500">Алдымен файлды таңдаңыз (PDF немесе DOCX)</p>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center transition-all ${
                  isDragging ? "border-primary bg-primary-tint" : "border-neutral-200 bg-neutral-50"
                } ${file ? "border-success bg-success-tint/20" : ""}`}
              >
                {!file ? (
                  <>
                    <div className="h-16 w-16 rounded-full bg-primary-tint flex items-center justify-center text-primary mb-6">
                      <CloudUpload size={32} />
                    </div>
                    <p className="text-lg font-medium mb-2">Файлды осында сүйреңіз</p>
                    <p className="text-sm text-neutral-400 mb-8">немесе</p>
                    <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
                      Файл таңдау
                    </Button>
                    <input 
                      id="fileInput" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const f = e.target.files[0];
                          setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + " MB" });
                        }
                      }}
                    />
                    <p className="mt-8 text-xs text-neutral-400 flex items-center gap-1">
                      <Info size={14} /> Максималды өлшем: 50МБ
                    </p>
                  </>
                ) : (
                  <div className="w-full max-w-md">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-success/30 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-success-tint flex items-center justify-center text-success">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{file.name}</div>
                          <div className="text-xs text-neutral-400">{file.size}</div>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="text-neutral-400 hover:text-danger">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="h-full bg-success"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  disabled={!file} 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setStep(2)}
                >
                  Жалғастыру <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">Жұмыс мәліметтері</h1>
                <p className="text-neutral-500">Барлық міндетті өрістерді толтырыңыз</p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Жұмыс тақырыбы*</label>
                  <Input placeholder="Толық тақырыпты енгізіңіз" className="h-12 text-base" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Жұмыс түрі*</label>
                    <select className="flex h-[40px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 transition-all">
                      <option>Дипломдық жұмыс</option>
                      <option>Курстық жұмыс</option>
                      <option>Ғылыми мақала</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Автор(лар)*</label>
                    <Input placeholder="Аты-жөні" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Факультет*</label>
                    <select className="flex h-[40px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 transition-all">
                      <option>АТ факультеті</option>
                      <option>Экономика</option>
                      <option>Математика</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Жылы*</label>
                    <Input type="number" defaultValue={2024} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Тіл*</label>
                  <div className="flex p-1 bg-neutral-100 rounded-md w-fit">
                    {["ҚАЗ", "РУС", "ENG"].map((l) => (
                      <button key={l} className={`px-6 py-1.5 rounded text-xs font-bold transition-all ${l === "ҚАЗ" ? "bg-white text-primary shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Аннотация*</label>
                  <div className="relative">
                    <textarea 
                      className="w-full rounded-sm border border-neutral-200 bg-white p-3 text-sm min-h-[160px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 transition-all"
                      placeholder="Жұмыстың қысқаша мазмұны..."
                    />
                    <span className="absolute bottom-3 right-3 text-[10px] text-neutral-400">0/2000</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Кілт сөздер</label>
                  <div className="flex flex-wrap gap-2 p-2 border border-neutral-200 rounded-sm min-h-[40px]">
                    <Badge variant="tag" className="gap-1 pr-1">машиналық оқыту <X size={12} className="cursor-pointer" /></Badge>
                    <Badge variant="tag" className="gap-1 pr-1">Python <X size={12} className="cursor-pointer" /></Badge>
                    <button className="text-primary text-xs font-bold px-2">+</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" size="lg" className="gap-2" onClick={() => setStep(1)}>
                  <ArrowLeft size={18} /> Артқа
                </Button>
                <Button size="lg" className="gap-2" onClick={() => setStep(3)}>
                  Жалғастыру <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">Тексеру</h1>
                <p className="text-neutral-500">Жібермес бұрын мәліметтерді тексеріп шығыңыз</p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-primary" />
                    <span className="font-medium">{file?.name}</span>
                  </div>
                  <Badge variant="approved">Дайын</Badge>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {[
                      { label: "Тақырып", value: "Машиналық оқыту негізінде медициналық кескіндерді талдау жүйесін әзірлеу" },
                      { label: "Жұмыс түрі", value: "Дипломдық жұмыс" },
                      { label: "Автор", value: "Айдана Серік" },
                      { label: "Факультет", value: "АТ факультеті" },
                      { label: "Жылы", value: "2024" },
                      { label: "Тіл", value: "Қазақша" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.label}</div>
                        <div className="text-sm font-medium text-neutral-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Аннотация</div>
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-4">
                      Бұл жұмыста нейрондық желілерді қолдана отырып, рентген кескіндеріндегі патологияларды автоматты түрде анықтау әдістері қарастырылған. Зерттеу барысында 5000-нан астам кескін талданып, жүйенің дәлдігі 94%-ға жетті...
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary/25" />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Жұмыстың өз авторлығым екенін растаймын және плагиат жоқтығына кепілдік беремін.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary/25" />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    Пайдалану шарттарымен және жұмыстың ашық репозиторийде жариялануымен келісемін.
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" size="lg" className="gap-2" onClick={() => setStep(2)}>
                  <ArrowLeft size={18} /> Өңдеу
                </Button>
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 px-12">
                    Жариялау <Check size={18} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
