import { fetchHorarioTurmas } from './fetchHorarioTurmas.js';

const {
  periodos,
  disciplinas,
  professores,
  turmas,
  salasDeAula,
  horarioTurmas,
} = await fetchHorarioTurmas();

const turma = horarioTurmas.find(t => t.nome.includes('ADS'));
console.log(JSON.stringify(turma, null, 2));