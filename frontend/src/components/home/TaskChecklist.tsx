'use client';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Project } from '@/types/project';

interface TaskChecklistProps {
  projects: Project[];
  loading?: boolean;
}

export default function TaskChecklist({ projects, loading = false }: TaskChecklistProps) {
  const [tasks, setTasks] = useState<Array<{ id: number; texto: string; concluida: boolean; prioridade: string }>>([]);

  useEffect(() => {
    // Gerar tarefas baseadas nos projetos recebidos
    const generatedTasks = (projects || [])
      .filter(p => p.dashboard?.proxima_atividade)
      .map((p, idx) => ({
        id: idx + 1,
        texto: `${p.dashboard?.proxima_atividade} - ${p.nome}`,
        concluida: false,
        prioridade: (p.dashboard?.dias_restantes ?? 100) < 7 ? 'alta' : 
                   (p.dashboard?.dias_restantes ?? 100) < 30 ? 'media' : 'baixa',
      }));

    setTasks(generatedTasks);
  }, [projects]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, concluida: !task.concluida } : task
    ));
  };

  const tarefasPendentes = tasks.filter(t => !t.concluida).length;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-base">Tarefas de Hoje</h3>
        {tasks.length > 0 && (
          <div className="bg-gradient-to-r from-[#F2C94C]/20 to-[#F2C94C]/10 backdrop-blur rounded-full px-3 py-1.5 border border-[#F2C94C]/20">
            <span className="text-[#F2C94C] text-xs font-bold">
              {tarefasPendentes} pendentes
            </span>
          </div>
        )}
      </div>
      
      {tasks.length === 0 && !loading ? (
        <div className="text-center py-8">
          <div className="bg-white/5 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Clock size={24} className="text-white/30" />
          </div>
          <p className="text-white/50 text-sm">
            Nenhuma tarefa no momento.<br />
            Crie um projeto para começar!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-[1.02]"
          >
            {task.concluida ? (
              <CheckCircle2 size={22} className="text-[#00A86B] shrink-0 mt-0.5" strokeWidth={2.5} />
            ) : (
              <Circle size={22} className="text-white/30 shrink-0 mt-0.5" strokeWidth={2} />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.concluida ? 'text-white/40 line-through' : 'text-white'}`}>
                {task.texto}
              </p>
              {!task.concluida && (
                <div className="flex items-center gap-2 mt-1.5">
                  <Clock size={13} className="text-white/30" />
                  <span className={`text-xs font-medium ${
                    task.prioridade === 'alta' ? 'text-red-400' :
                    task.prioridade === 'media' ? 'text-[#F2C94C]' :
                    'text-white/40'
                  }`}>
                    {task.prioridade === 'alta' ? '🔥 Urgente' :
                     task.prioridade === 'media' ? '⏰ Hoje' : '📅 Esta semana'}
                  </span>
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
