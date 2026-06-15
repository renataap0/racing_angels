# Notas - Migração para Campeonato 8 pistas e todas as voltas

## Objetivo
- Preservar o app atual (races) para não quebrar.
- Introduzir novo storage: `racingAngelsSeason`.
- Estrutura inicial (versão 1):

```js
season = {
  version: 1,
  createdAt: ISOString,
  rounds: [
    {
      id: number,
      index: 1..8,
      trackName: string,
      status: 'scheduled'|'running'|'finished',
      recordsByDriver: {
        'Driver Name': {
          team: string,
          car: string,
          lapTimesMs: number[], // todas as voltas
          strategy: { paceTrend: string, consistencyMs: number },
          createdAt: ISOString
        }
      }
    }
  ]
}
```

## MVP da migração (por enquanto)
- Implementar helpers no `script.js`:
  - getSeason()/saveSeason()
  - parseLapTime -> ms (existe)
  - formatMilliseconds -> string (existe)
- Criar função para importar automaticamente as corridas antigas `racingAngelsRaces`:
  - agrupar por `inferTrackName(race.race)`
  - para cada piloto criar `lapTimesMs` com base em `bestLap` e `lastLap` (placeholder):
    - lapTimesMs = [bestLapMs, lastLapMs] (ou repetir bestLap até laps, mas sem dados reais)
  - mapear para 1..8 rounds.

Depois disso, ajustar UI e rankings.

