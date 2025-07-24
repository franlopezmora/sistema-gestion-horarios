import React from 'react'
import './ScheduleGrid.css'

const days  = ['lunes','martes','miércoles','jueves','viernes','sábado']
const startHour = 8
const endHour = 23
const stepMinutes = 5

const hours = []
for (let h = startHour; h <= endHour; h++) {
  for (let m = 0; m < 60; m += stepMinutes) {
    // cortar en 23:05
    if (h === 23 && m > 5) break
    hours.push(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`)
  }
}

export default function ScheduleGrid({
  fixedBlocks = [],
  previewBlocks = [],
  onBlockClick
}) {
    const HEADER_H = 40;
    const TIME_W = 60;
    const startHour = 8
    const endHour = 23
    const stepMinutes = 5

    const timeSlots = []
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += stepMinutes) {
        // opcional: cortar en 23:05
        if (h === 23 && m > 5) break
        timeSlots.push(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`)
      }
    }

    // calcula altura dinámica para que entre todo
    const ROW_H = 5
    const COL_W = `calc((100% - ${TIME_W}px)/6)`;

  return (
    <div className="schedule-grid-container">

      <div className="grid header">
          <div className="cell time-header" style={{ width: TIME_W }}>
              <div className="hour-inner">Hora</div>
          </div>
        {days.map(d => (
          <div key={d} className="cell day-header">
            {d.charAt(0).toUpperCase()+d.slice(1)}
          </div>
        ))}
      </div>


      <div className="grid body">
        {timeSlots.map(t => (
          <React.Fragment key={t}>
            <div className="cell time-label" style={{ width: TIME_W, height: ROW_H }}>
              {t.endsWith(':00') ? t : ''} {/* mostramos solo las horas completas */}
            </div>
            {days.map(d => (
              <div key={`${d}-${t}`} className="cell slot" />
            ))}
          </React.Fragment>
        ))}
      </div>


      <div className="blocks-overlay">
        {fixedBlocks.map((blk,i) => {
          const [hs, hm] = blk.horaEntrada.split(':').map(Number)
          const [he, em] = blk.horaSalida.split(':').map(Number)
          const minutesFromStart = (h, m) => (h - startHour) * 60 + m

          const top = (minutesFromStart(hs, hm) / stepMinutes) * ROW_H + HEADER_H
          const height = ((minutesFromStart(he, em) - minutesFromStart(hs, hm)) / stepMinutes) * ROW_H
          const colIdx = days.indexOf(blk.dia)
          const left   = `calc(${TIME_W}px + ${colIdx}*${COL_W})`
          return (
            <div
              key={i}
              className="block fixed"
              style={{ top, left, width: COL_W, height }}
            >{blk.render}</div>
          )
        })}

        {previewBlocks.map((blk,i) => {
          const [hs, hm] = blk.horaEntrada.split(':').map(Number)
          const [he, em] = blk.horaSalida.split(':').map(Number)
          const minutesFromStart = (h, m) => (h - startHour) * 60 + m

          const top = (minutesFromStart(hs, hm) / stepMinutes) * ROW_H + HEADER_H
          const height = ((minutesFromStart(he, em) - minutesFromStart(hs, hm)) / stepMinutes) * ROW_H
          const colIdx = days.indexOf(blk.dia)
          const left   = `calc(${TIME_W}px + ${colIdx}*${COL_W})`
          return (
            <div
              key={i}
              className={`block preview${blk.disabled?' disabled':''}`}
              style={{ top, left, width: COL_W, height }}
              onClick={() => !blk.disabled && onBlockClick(blk)}
            >{blk.render}</div>
          )
        })}
      </div>
    </div>
  )
}
