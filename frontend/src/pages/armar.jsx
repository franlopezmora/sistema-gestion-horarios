import React, { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import ScheduleGrid from '../components/ScheduleGrid'

import { materiasMock }  from '../mocks/materiasMocks'
import { comisionesMock } from '../mocks/comisionesMock'

export default function Armar() {
  const navigate = useNavigate()
  const { search } = useLocation()

  const materiaIds = useMemo(() => {
    const q = new URLSearchParams(search).get('materiaIds') || ''
    return q.split(',').map(Number).filter(Boolean)
  }, [search])


  const selectedCuatri = useMemo(() => {
    const c = new URLSearchParams(search).get('cuatri')
    return c == null ? 0 : Number(c)
  }, [search])


  useEffect(() => {
    if (materiaIds.length === 0) {
      navigate('/', { replace: true })
    }
  }, [materiaIds, navigate])

  if (!materiaIds.length) return null


  const allMaterias = materiasMock
  const allComisiones = comisionesMock.filter(c =>
    materiaIds.includes(c.materiaId)
  )


  const comisiones = useMemo(() =>
    allComisiones.filter(c =>
      c.periodo === 0 || c.periodo === selectedCuatri
    ),
    [allComisiones, selectedCuatri]
  )

  
  const selectedMaterias = useMemo(
    () => allMaterias.filter(m => materiaIds.includes(m.id)),
    [allMaterias, materiaIds]
  )


  const [previewMateriaId, setPreviewMateriaId] = useState(null)
  const [fixedBlocks, setFixedBlocks]= useState([])


  const toMin = hora => {
    const [h, m] = hora.split(':').map(Number)
    return (h - 8) * 60 + m
  }


  const isChocante = horarios => {
    const actuales = fixedBlocks.map(b => ({
      dia:   b.dia,
      start: toMin(b.horaEntrada),
      end:   toMin(b.horaSalida)
    }))
    return horarios.some(h => {
      const s2 = toMin(h.horaEntrada), e2 = toMin(h.horaSalida)
      return actuales.some(a =>
        a.dia === h.dia && a.start < e2 && s2 < a.end
      )
    })
  }


  const previewBlocks = useMemo(() => {
    if (!previewMateriaId) return []
    return comisiones
      .filter(c => c.materiaId === previewMateriaId)
      .flatMap(c =>
        c.horarios.map(h => ({
          dia:         h.dia,
          horaEntrada: h.horaEntrada,
          horaSalida:  h.horaSalida,
          comisionId:  c.comisionId,
          materiaId:   c.materiaId,
          disabled:    isChocante(c.horarios),
          render: (
            <div style={{ padding: 4, fontSize: '0.78rem' }}>
              <strong>{
                allMaterias.find(m => m.id === c.materiaId).nombre
              }</strong><br/>
              Nivel {allMaterias.find(m => m.id === c.materiaId).nivel}
              &nbsp;{c.carrera}&nbsp;Sección {c.seccion}
            </div>
          )
        }))
      )
  }, [previewMateriaId, comisiones, allMaterias, fixedBlocks])


  const onBlockSelect = blk => {
    const com = allComisiones.find(c => c.comisionId === blk.comisionId)
    if (!com) return
    const nuevosFijos = com.horarios.map(h => ({
      dia:         h.dia,
      horaEntrada: h.horaEntrada,
      horaSalida:  h.horaSalida,
      materiaId:   com.materiaId,
      comisionId:  com.comisionId,
      render:      blk.render
    }))
    setFixedBlocks(prev => [...prev, ...nuevosFijos])
    setPreviewMateriaId(null)
  }

  
  return (
    <Container fluid className="py-3" style={{ width: '100%' }}>
      <Row className="mb-2">
        <Col>
          <h5 style={{marginTop: '1rem'}}>
            Cuatrimestre:{" "}
            {selectedCuatri === 0
              ? "Anual"
              : `${selectedCuatri}º Cuatrimestre`}
          </h5>
        </Col>
      </Row>

      <Row>
        <Col xs={12} lg={12} style={{ position: 'relative', width: '100%' }}>
          <ScheduleGrid
            fixedBlocks={fixedBlocks}
            previewBlocks={previewBlocks}
            onBlockClick={onBlockSelect}
          />
        </Col>

      
        <Col xs={12} lg={3}>
          <h5>Materias</h5>
          {selectedMaterias.map(m => {
            const yaFijada = fixedBlocks.some(b => b.materiaId === m.id)
            return (
              <Button
                key={m.id}
                variant={
                  previewMateriaId === m.id ? 'primary'
                  : yaFijada               ? 'success'
                                           : 'outline-primary'
                }
                className="w-100 mb-2"
                disabled={yaFijada}
                onClick={() => setPreviewMateriaId(m.id)}
              >
                {m.codigo} – {m.nombre}
              </Button>
            )
          })}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button onClick={() => console.log('Fixed:', fixedBlocks)}>
            Exportar PDF/EXCEL
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
