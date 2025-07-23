import React from 'react'
import './ScheduleGrid.css'

const days  = ['lunes','martes','miércoles','jueves','viernes','sábado']
const hours = Array.from({ length: 16 }, (_, i) => 8 + i)

export default function ScheduleGrid({
  fixedBlocks = [],
  previewBlocks = [],
  onBlockClick
}) {
  const HEADER_H = 40
  const TIME_W   = 60
  const ROW_H    = 60
  const COL_W    = `calc((100% - ${TIME_W}px)/6)`

  return (
    <div className="schedule-grid-container">
      
      <div className="grid header">
        <div className="cell time-header" style={{ width: TIME_W }} />
        {days.map(d => (
          <div key={d} className="cell day-header">
            {d.charAt(0).toUpperCase()+d.slice(1)}
          </div>
        ))}
      </div>

     
      <div className="grid body">
        {hours.map(h => (
          <React.Fragment key={h}>
            <div className="cell time-label" style={{ width: TIME_W }}>
              {h}:00
            </div>
            {days.map(d => (
              <div key={`${d}-${h}`} className="cell slot" />
            ))}
          </React.Fragment>
        ))}
      </div>

     
      <div className="blocks-overlay">
        {fixedBlocks.map((blk,i) => {
          const [hs, hm] = blk.horaEntrada.split(':').map(Number)
          const [he, em] = blk.horaSalida.split(':').map(Number)
          const top    = (hs-8)*ROW_H+HEADER_H
          const height = ((he*60+em)-(hs*60+hm))/60*ROW_H
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
          const top    = (hs-8)*ROW_H+HEADER_H
          const height = ((he*60+em)-(hs*60+hm))/60*ROW_H
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
