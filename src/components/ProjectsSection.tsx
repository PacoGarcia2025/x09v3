import { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { PROJECTS } from '../data/projects';
import { ArrowUpRight, CheckCircle2, Github, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
}

export function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'web-app', label: 'SaaS & Web Apps' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'ui-ux', label: 'Design System' },
    { id: 'infrastructure', label: 'DevOps & VPS' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="projetos" className="scroll-mt-24 border-t border-zinc-800/80 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              <span>01 // Portfólio Selecionado</span>
            </div>
            <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Projetos e Casos de Sucesso
            </h2>
            <p className="mt-3 max-w-2xl text-base text-zinc-400">
              Soluções reais construídas com rigor técnico, estética refinada e performance intransigente.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                    : 'border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-cyan-950/20"
            >
              {/* Image Preview with Hover Zoom */}
              <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-2.5 py-1 font-mono text-[11px] font-medium text-cyan-300 backdrop-blur-md">
                    {project.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="rounded-lg bg-zinc-900/80 px-2 py-0.5 font-mono text-[10px] text-zinc-400 backdrop-blur-md">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  {project.client}
                </div>
                <h3 className="mt-1 font-['Space_Grotesk'] text-xl font-bold text-white transition-colors group-hover:text-cyan-300">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                {/* Metrics if available */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-2.5">
                    {project.metrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-white">{m.value}</span>
                        <span className="text-[10px] text-zinc-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="rounded-md bg-zinc-800/40 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 transition-colors hover:text-cyan-300"
                  >
                    <span>Ver Estudo de Caso</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
                        title="Ver no GitHub"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
