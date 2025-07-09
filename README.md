# 📘 Edupage Restinga Horários - Extração via API

Este projeto contém uma função `fetchHorarioTurmas()` que consome a API interna da plataforma [Edupage Restinga](https://restinga.edupage.org/timetable/) e transforma os dados brutos do horário escolar em uma estrutura organizada e fácil de consumir.

---

## 🔧 Tecnologias

- **Node.js** (ES Modules)
- **Axios** (requisições HTTP)
- **HTTPS Agent** (forçando IPv4)

---

## 📦 Instalação

```bash
npm install axios
```

## 📄 Uso
Importe e execute a função:

```
import { fetchHorarioTurmas } from './fetchHorarioTurmas.js';

const {
  periodos,
  disciplinas,
  professores,
  turmas,
  salasDeAula,
  horarioTurmas,
} = await fetchHorarioTurmas();

```

## 📚 Descrição dos Dados
A função retorna um objeto com as seguintes propriedades:

### `periodos` 
Lista dos períodos (aulas), com horários de início e fim:

```
[
  {
    "id": "16",
    "period": "16",
    "name": "4",
    "short": "4",
    "starttime": "21:40",
    "endtime": "22:30"
  }
]
```

### `disciplinas`

Lista de disciplinas cadastradas:

```
[
  {
    "id": "*274",
    "name": "Turismo e o Espaço Sulriograndense",
    "short": "Turismo e o Espaço Sulriograndense"
  }
]
```


### `professores`
Lista dos professores com seus identificadores:


```
[
  {
    "id": "*5",
    "name": "*André Estrela",
    "short": "André E"
  }
]
```


### `turmas`
Informações das turmas (ex: nomes e IDs):

```
[
  {
    "id": "*41",
    "name": "SUB e CONC - INFORMÁTICA - 2",
    "short": "Conc. e SubsequenteI - NFORMÁTICA - 2"
  }
]
```

### `salasDeAula`
Salas utilizadas pelas turmas:

```
[
  {
    "id": "*32",
    "name": "517 -  Lab Tur., Hosp e Lazer",
    "short": "517 -  Lab Tur., Hosp e Lazer"
  }
]
```

### `horarioTurmas`
Horários organizados por turma e dia da semana:
```
[
  {
    "id": "-378",
    "nome": "111",
    "dias": {
      "seg": {
        "7": {
          "id": "*25",
          "disciplina": {
            "id": "*152",
            "nome": "Língua Portuguesa e Literatura"
          },
          "professores": [
            {
              "id": "*13",
              "nome": "Cassiana Grigoletto"
            }
          ],
          "salas": [
            {
              "id": "-3",
              "name": "303",
              "short": "303"
            }
          ],
          "horarios": [
            "13:30 - 14:20",
            "14:20 - 15:10",
            "15:10 - 16:00"
          ]
        }
      },
      "ter": { ... },
      "qua": { ... },
      "qui": { ... },
      "sex": { ... }
    }
  }
]
```

## 💡 Observações Técnicas
O acesso à API exige forçar conexões via IPv4, não consegui fazer comunicação de outra forma.

Por algum motivo a API retorna os dias da semana em formato binário (ex: '10000' representa segunda-feira), foi necessário corrigir isso no código.

Os cards representam as instâncias físicas das aulas (em dias, horários e salas), e são cruzados com lessons, teachers, subjects, etc.

## 🧪 Exemplo prático
Você pode usar os dados assim:
```
const turma = horarioTurmas.find(t => t.nome.includes('ADS'));
console.log(JSON.stringify(turma, null, 2));
```
