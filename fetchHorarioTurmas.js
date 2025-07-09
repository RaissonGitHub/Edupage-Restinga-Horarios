import axios from 'axios';
import { Agent } from 'https';

export async function fetchHorarioTurmas() {
  const url =
    'https://restinga.edupage.org/timetable/server/regulartt.js?__func=regularttGetData';
  const body = { __args: [null, '47'], __gsh: '00000000' };

  // força IPv4 (evita ENETUNREACH p/ IPv6)
  // So consegui acessar dessa forma
  const httpsAgent = new Agent({ family: 4 });

  const { data: raw } = await axios.post(url, body, {
    httpsAgent,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10_000,
  });

  // utilitário local para pegar cada tabela
  const getTable = (id) =>
    raw?.r?.dbiAccessorRes?.tables?.find((t) => t.id === id)?.data_rows || [];

  const periodos = getTable('periods').map((p) => ({
    id: p.id,
    period: p.period,
    name: p.name,
    short: p.short,
    starttime: p.starttime,
    endtime: p.endtime,
  }));

  const disciplinas = getTable('subjects').map((d) => ({
    id: d.id,
    name: d.name,
    short: d.short,
  }));

  const professores = getTable('teachers').map((p) => ({
    id: p.id,
    name: p.name,
    short: p.short,
  }));

  const turmas = getTable('classes').map((c) => ({
    id: c.id,
    name: c.name,
    short: c.short,
  }));

  const salasDeAula = getTable('classrooms').map((s) => ({
    id: s.id,
    name: s.name,
    short: s.short,
  }));

  // lições e cards brutos (fazem a relacao entre tudo)
  const lessons = getTable('lessons');
  const cards = getTable('cards');

  // dias vêm em binário por algum motivo
  const diasMap = {
    '10000': 'seg',
    '01000': 'ter',
    '00100': 'qua',
    '00010': 'qui',
    '00001': 'sex',
  };

  const horarioTurmas = turmas.map((turma) => {
    const dias = { seg: {}, ter: {}, qua: {}, qui: {}, sex: {} };
    const aulasTurma = lessons.filter((a) => a.classids?.includes(turma.id));

    aulasTurma.forEach((aula) => {
      const cardsDaAula = cards.filter((c) => c.lessonid === aula.id);
      const disciplina = disciplinas.find((d) => d.id === aula.subjectid);
      const profs = professores.filter((p) => aula.teacherids.includes(p.id));
      const duracao = aula.durationperiods;

      cardsDaAula.forEach((card) => {
        const dia = diasMap[card.days];
        if (!dia) return;

        const inicio = parseInt(card.period, 10) - 1;
        const horarios = periodos
          .slice(inicio, inicio + duracao)
          .map(({ starttime, endtime }) => `${starttime} - ${endtime}`);

        const salas = card.classroomids.map((id) =>
          salasDeAula.find((s) => s.id === id),
        );

        dias[dia][card.period] = {
          id: card.id,
          disciplina: { id: disciplina.id, nome: disciplina.name },
          professores: profs.map((p) => ({ id: p.id, nome: p.name })),
          salas,
          horarios,
        };
      });
    });

    return { id: turma.id, nome: turma.name, dias };
  });

  return {
    periodos,
    disciplinas,
    professores,
    turmas,
    salasDeAula,
    horarioTurmas,
  };
}
