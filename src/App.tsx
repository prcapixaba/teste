import {
  Scale,
  ArrowRight,
  History,
  Workflow,
  ShieldCheck,
  Gavel,
  CheckCircle2,
  Shield,
  Users,
  Banknote,
  AlertTriangle,
  FileCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
  Instagram,
  Linkedin
} from 'lucide-react';

function App() {
  return (
    <div className="dark">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-primary/10 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <Scale size={36} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-wider uppercase">Marques & Associados</span>
              <span className="text-[10px] text-primary tracking-[0.2em] uppercase">Advocacia Criminal</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-10">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#inicio">Início</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#sobre">Sobre</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#areas">Áreas de Atuação</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#blog">Blog</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#contato">Contato</a>
          </nav>
          <button className="bg-primary hover:bg-accent-gold text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
            Agendar Consulta
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background-dark" id="inicio">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
          <img className="w-full h-full object-cover" alt="Modern high-end law office interior with wooden desk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0vmVRUOjxSkwz-hmBj25mjr72nKkyZ6NBuRcU2yBKDGVU3O_hHlGcH0-BZixzAnNLpHUX0O8tCtWk7Ga-W6IunwzqVqPl8VWsOpZONkZtTIpOxYgkNAEOHRcy2w-g3eFxI7OO3vW0Sn-TpxOLQpnDOn49S7ArLZAE0DPyd8Cj7V2CTnLgo6HpWXNf4iYbuuaaws4t21YWjsT8nalTeN7LjjzT9quSfTgSXd-VJtScPH0XOrsD7k8vW6PvA6lMSY2B_UtRV4-4IaQ" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Defesa Criminal Especializada
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Defesa Criminal <span className="text-primary italic font-light">Estratégica</span> e de Alto Nível
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Atuação especializada em Direito Penal e Processual Penal com experiência, estratégia personalizada e compromisso inabalável com a liberdade do cliente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary hover:bg-accent-gold text-background-dark px-8 py-4 rounded-lg text-lg font-bold transition-all flex items-center justify-center gap-2 group">
                Agendar Consulta Jurídica
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-slate-700 hover:border-primary text-white px-8 py-4 rounded-lg text-lg font-medium transition-all backdrop-blur-sm">
                Conhecer o Escritório
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-surface-dark py-12 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <History className="text-primary w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Experiência</h4>
                <p className="text-xs text-slate-400">Consolidada em casos complexos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Workflow className="text-primary w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Estratégia</h4>
                <p className="text-xs text-slate-400">Personalizada para cada caso</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-primary w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Confidencial</h4>
                <p className="text-xs text-slate-400">Sigilo absoluto e discrição</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Gavel className="text-primary w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Atuação</h4>
                <p className="text-xs text-slate-400">Combativa em todas as instâncias</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background-dark" id="sobre">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary"></div>
              <img className="rounded-lg shadow-2xl relative z-10 w-full h-[600px] object-cover" alt="A sophisticated library in a law office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCauJk1DKwqOitQxb9vtf355TEYc_xYP_96Jioa7MzRf3oKGbgJc0z9ad4zELu2M9XGELga9x9N8hmPxSvHcqz72vCmhBNrktBWHBTzKkmqGYLgAplByVAjMCN5ow7tUGCFrVLqGAXezL5sm2oIvP3tB7SzCsKryVd3W4xCq8SJEw7gzSjYVZeFmIJ1dXUZCS7vlJw1RrbHmwiMzddPGI-g2c2q6edZhKj2gINZhXBJt3NsjQP6cEyuYKGOceB1n70zvnlPE6aYWbU" />
              <div className="absolute -bottom-10 -right-10 bg-primary p-8 rounded-lg z-20 hidden md:block">
                <p className="text-background-dark text-4xl font-black">15+</p>
                <p className="text-background-dark text-sm font-bold uppercase tracking-tighter">Anos de Experiência</p>
              </div>
            </div>
            <div>
              <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4">O Escritório</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Trajetória e Excelência Jurídica</h3>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p>
                  Nossa atuação é pautada pelo rigor técnico e pela busca incessante da justiça. Com sede em ambiente corporativo de alto padrão, oferecemos aos nossos clientes o suporte necessário para enfrentar as complexidades do sistema penal brasileiro.
                </p>
                <p>
                  Acreditamos que cada caso exige uma arquitetura jurídica única. Não trabalhamos com soluções genéricas; cada defesa é construída através de uma análise minuciosa de evidências e jurisprudências dos tribunais superiores.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 flex-shrink-0" />
                    <span>Autoridade reconhecida em crimes de colarinho branco</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 flex-shrink-0" />
                    <span>Segurança jurídica e acompanhamento 24/7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-1 w-6 h-6 flex-shrink-0" />
                    <span>Infraestrutura moderna para atendimento exclusivo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-24 bg-surface-dark" id="areas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4">Expertise</h2>
            <h3 className="text-4xl font-bold text-white mb-6">Áreas de Atuação Especializada</h3>
            <p className="text-slate-400">Domínio técnico e atuação estratégica nos mais diversos segmentos do Direito Penal.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
              <Shield className="text-primary w-10 h-10 mb-6 block" />
              <h4 className="text-xl font-bold text-white mb-4">Defesa Criminal</h4>
              <p className="text-slate-400 mb-6">Atuação completa em inquéritos policiais e ações penais, garantindo o devido processo legal em todas as etapas.</p>
            </div>
            <div className="group p-8 rounded-xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
              <Users className="text-primary w-10 h-10 mb-6 block" />
              <h4 className="text-xl font-bold text-white mb-4">Tribunal do Júri</h4>
              <p className="text-slate-400 mb-6">Defesa técnica especializada perante o Conselho de Sentença em crimes dolosos contra a vida.</p>
            </div>
            <div className="group p-8 rounded-xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
              <Banknote className="text-primary w-10 h-10 mb-6 block" />
              <h4 className="text-xl font-bold text-white mb-4">Crimes Econômicos</h4>
              <p className="text-slate-400 mb-6">Consultoria e defesa em crimes contra o sistema financeiro, tributário e lavagem de dinheiro.</p>
            </div>
            <div className="group p-8 rounded-xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
              <AlertTriangle className="text-primary w-10 h-10 mb-6 block" />
              <h4 className="text-xl font-bold text-white mb-4">Habeas Corpus</h4>
              <p className="text-slate-400 mb-6">Medidas urgentes para a preservação da liberdade de locomoção e combate a constrangimentos ilegais.</p>
            </div>
            <div className="group p-8 rounded-xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
              <Gavel className="text-primary w-10 h-10 mb-6 block" />
              <h4 className="text-xl font-bold text-white mb-4">Recursos</h4>
              <p className="text-slate-400 mb-6">Interposição e sustentação oral em Tribunais de Justiça, TRFs, STJ e Supremo Tribunal Federal.</p>
            </div>
            <div className="group p-8 rounded-xl bg-background-dark border border-white/5 hover:border-primary/50 transition-all">
              <FileCheck className="text-primary w-10 h-10 mb-6 block" />
              <h4 className="text-xl font-bold text-white mb-4">Consultoria Preventiva</h4>
              <p className="text-slate-400 mb-6">Compliance criminal e prevenção de riscos jurídicos para executivos e empresas de alto padrão.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results/Institutional */}
      <section className="py-24 bg-background-dark overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none flex justify-end">
          <Building2 size={400} className="text-primary translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12 md:p-16">
            <div className="max-w-3xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">Atuação em Casos de Relevância</h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Nosso escritório possui um histórico sólido de atuação em casos de grande complexidade técnica e repercussão nacional. Mantemos uma presença constante nos Tribunais Superiores em Brasília (STJ e STF), onde defendemos teses inovadoras que visam a proteção das garantias constitucionais.
              </p>
              <p className="text-slate-400 italic text-sm mb-10 border-l-2 border-primary pl-6">
                "A advocacia criminal não é apenas uma profissão, é o exercício vigilante da liberdade contra os excessos do Estado."
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-primary text-2xl font-bold">STF / STJ</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Frequência em Tribunais</p>
                </div>
                <div>
                  <p className="text-primary text-2xl font-bold">Alta Complexidade</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Foco de Atuação</p>
                </div>
                <div>
                  <p className="text-primary text-2xl font-bold">Exclusividade</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Atendimento Boutique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-surface-dark" id="blog">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4">Conteúdo Jurídico</h2>
              <h3 className="text-4xl font-bold text-white mb-4">Blog e Atualizações</h3>
              <p className="text-slate-400">Análises técnicas sobre as principais mudanças legislativas e direitos fundamentais.</p>
            </div>
            <button className="text-primary hover:text-accent-gold font-bold flex items-center gap-2 group underline underline-offset-8">
              Ver todos os artigos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="group">
              <div className="relative overflow-hidden rounded-xl mb-6 h-64">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Legal papers and a fountain pen on a desk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfGLORLLxnXCg7P-K4f5SXBdC5pZP2_06trHql7rexo6LMQUwi8zWWsC9yhDMLU9uco7_jNE2BBBFPcaaKC9YBuK-HWNgbQDUyvAfp007ZYfINNKVSxTiUHwZxRjWfX-CMIj4sYn5_gGU-SkncZwKqsxTu_aOHvcPEsA6x6Fys1Sd7Vjzb6DhQPKs7b9qQSSig9mpeGz43I-uLs8_pu2kxTUJvG86SzmHlQyJ147Bu2YvUJQ5i7_cl7BlcDwH21uV9Wv8Ddn9DEbo" />
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Direito de Defesa</span>
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Direitos do Investigado: O que você precisa saber</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">Entenda os limites da atuação policial e as garantias fundamentais durante a fase de inquérito.</p>
              <a className="text-white text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors" href="#">Ler artigo <ExternalLink className="w-4 h-4" /></a>
            </article>
            <article className="group">
              <div className="relative overflow-hidden rounded-xl mb-6 h-64">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Courthouse pillars under dark sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXMbeVoveOpgJNFP_SrSGHYeY-Gz34wHi2GX0AaSF_euOVKeJYMUQZV9kM3Mmt5HHtWvXK96rR8yE17xbSxYXh06JWPmV_Yemd9jZ3LJoEdM5jWJ1xEYM1qk8fhNN6Mb9ogyOQa95dqspDGjiqJCaXHOBhrdo4lgT8n8cXp8cp1xkpAtffE-kAlhv8eDnnZ3bf0o-e5bb8hmnLUQIc44UjQMpsvjRXkTE9h1V7fVDTE8ipEky0WbOp1UVrpw7_RevTJoX4wQeplSI" />
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Habeas Corpus</span>
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Habeas Corpus: Quando impetrar esta medida?</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">A ferramenta jurídica mais poderosa para combater ilegalidades e garantir a liberdade individual.</p>
              <a className="text-white text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors" href="#">Ler artigo <ExternalLink className="w-4 h-4" /></a>
            </article>
            <article className="group">
              <div className="relative overflow-hidden rounded-xl mb-6 h-64">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Two people shaking hands in a business setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvWnr3SG_ZcyrFCMf7cBvhvj7vc6rsKM9wtRbd0T9MR8xSgdvAzhwjoA7dgybiXpHfs-ydzXXIyY6c5-EJAxPIjhsCQplYHZxudScoJTUOs0fAcwE9UUtMCXg6sJ58zxXDAsk9UF4RUlhI6LShG4eu9PFRe69aRjaVCTXqyE73ClD0yFfUqMyVnCxO6VkmgpVHeBECwzRxSuGvDvEXaJAbE6sA3356RyMVGhXf22t2lTJDhjDjnFZw-uYX6o0p_Dz6znoU4xiHVa4" />
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Estratégia</span>
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Estratégias na Prisão em Flagrante</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">Como a atuação imediata de um advogado especializado pode mudar o curso de uma detenção.</p>
              <a className="text-white text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors" href="#">Ler artigo <ExternalLink className="w-4 h-4" /></a>
            </article>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-background-dark border-t border-white/5" id="contato">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4">Contato</h2>
              <h3 className="text-4xl font-bold text-white mb-8">Estamos Prontos para sua Defesa</h3>
              <p className="text-slate-400 text-lg mb-12">Entre em contato para uma avaliação sigilosa do seu caso. Atendimento em regime de urgência disponível.</p>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-dark flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Endereço</h5>
                    <p className="text-slate-400">Av. Paulista, 1000 - Edifício Corporate Center<br/>São Paulo, SP - CEP 01310-100</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-dark flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">WhatsApp de Emergência</h5>
                    <p className="text-primary text-xl font-bold">(11) 99999-0000</p>
                    <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-lg text-sm font-bold border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
                      <MessageSquare className="w-4 h-4" /> Chamar no WhatsApp
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-dark flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">E-mail</h5>
                    <p className="text-slate-400">contato@marquesadvocacia.com.br</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-dark p-8 md:p-12 rounded-2xl border border-white/5">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nome Completo</label>
                    <input className="w-full bg-background-dark border border-white/10 rounded-lg py-3 px-4 focus:border-primary focus:ring-1 focus:outline-none text-white transition-all" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">E-mail</label>
                    <input className="w-full bg-background-dark border border-white/10 rounded-lg py-3 px-4 focus:border-primary focus:ring-1 focus:outline-none text-white transition-all" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Telefone / WhatsApp</label>
                  <input className="w-full bg-background-dark border border-white/10 rounded-lg py-3 px-4 focus:border-primary focus:ring-1 focus:outline-none text-white transition-all" type="tel" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Assunto</label>
                  <select className="w-full bg-background-dark border border-white/10 rounded-lg py-3 px-4 focus:border-primary focus:ring-1 focus:outline-none text-white transition-all appearance-none">
                    <option>Defesa Criminal</option>
                    <option>Tribunal do Júri</option>
                    <option>Crimes Econômicos</option>
                    <option>Habeas Corpus</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mensagem</label>
                  <textarea className="w-full bg-background-dark border border-white/10 rounded-lg py-3 px-4 focus:border-primary focus:ring-1 focus:outline-none text-white transition-all" rows={4}></textarea>
                </div>
                <button className="w-full bg-primary hover:bg-accent-gold text-background-dark font-bold py-4 rounded-lg transition-all shadow-lg shadow-primary/20" type="submit">
                  Enviar Solicitação de Contato
                </button>
                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">Garantimos sigilo absoluto conforme o Código de Ética da OAB.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0c0f] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-primary">
                  <Scale size={36} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-bold tracking-wider uppercase text-white">Marques & Associados</span>
                  <span className="text-xs text-primary tracking-[0.2em] uppercase">Advocacia Criminal</span>
                </div>
              </div>
              <p className="text-slate-500 max-w-sm mb-6">
                Escritório boutique dedicado exclusivamente à defesa criminal estratégica, com atuação personalizada e foco em resultados de alta complexidade.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center text-slate-400 hover:text-primary transition-colors" href="#">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center text-slate-400 hover:text-primary transition-colors" href="#">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Links Rápidos</h5>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#inicio">Página Inicial</a></li>
                <li><a className="hover:text-primary transition-colors" href="#sobre">Sobre o Escritório</a></li>
                <li><a className="hover:text-primary transition-colors" href="#areas">Áreas de Atuação</a></li>
                <li><a className="hover:text-primary transition-colors" href="#blog">Conteúdo e Artigos</a></li>
                <li><a className="hover:text-primary transition-colors" href="#contato">Fale Conosco</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Informativo Jurídico</h5>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Este site segue as normas do Código de Ética e Disciplina da OAB. Seu conteúdo tem caráter meramente informativo.
              </p>
              <p className="text-slate-500 text-xs">OAB/SP 000.000</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            <p>© 2024 Marques & Associados. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a className="hover:text-white transition-colors" href="#">Privacidade</a>
              <a className="hover:text-white transition-colors" href="#">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;