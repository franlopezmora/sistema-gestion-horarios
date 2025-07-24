 import React, { useEffect, useState, useMemo } from 'react'
 import { useLocation, useNavigate } from 'react-router-dom'
 import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
 import ScheduleGrid from '../components/ScheduleGrid'

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

  // ➡️ Estados
  const [allMaterias, setAllMaterias] = useState([]);
  const [allComisiones, setAllComisiones] = useState([]);
  const [previewMateriaId, setPreviewMateriaId] = useState(null);
  const [fixedBlocks, setFixedBlocks] = useState([]);


  const comisiones = useMemo(() =>
    allComisiones.filter(c =>
      c.periodo === 0 || c.periodo === selectedCuatri
    ),
    [allComisiones, selectedCuatri]
  );

  // 🔥 Redirigir si no hay materias seleccionadas
  useEffect(() => {
    if (materiaIds.length === 0) {
      navigate("/", { replace: true });
    }
  }, [materiaIds, navigate]);

  useEffect(() => {
    if (materiaIds.length > 0) {
      const params = materiaIds.join(',');
      fetch(`http://localhost:8080/api/materias/seleccionadas?ids=${params}`)
        .then(res => res.json())
        .then(data => setAllMaterias(data))
        .catch(err => console.error("Error cargando materias seleccionadas:", err));
    }
  }, [materiaIds]);

  const selectedMaterias = useMemo(
    () => allMaterias.filter(m => materiaIds.includes(m.id)),
    [allMaterias, materiaIds]
  );

  useEffect(() => {
    const fetchComisiones = async () => {
      try {
        const comisionesAcumuladas = [];
        for (let materiaId of materiaIds) {
          const res = await fetch(
            `http://localhost:8080/api/materias/${materiaId}/comisiones`
          );
          const data = await res.json();
          comisionesAcumuladas.push(...data);
        }
        setAllComisiones(comisionesAcumuladas);
      } catch (err) {
        console.error("Error cargando comisiones:", err);
      }
    };
    if (materiaIds.length > 0) fetchComisiones();
  }, [materiaIds]);


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

  const ordenarHorarios = (horarios) => {
    return [...horarios].sort((a, b) => {
      if (Number(a.dia) !== Number(b.dia)) {
        return Number(a.dia) - Number(b.dia);
      }
      const [ha, ma] = a.horaEntrada.split(':').map(Number);
      const [hb, mb] = b.horaEntrada.split(':').map(Number);
      return (ha * 60 + ma) - (hb * 60 + mb);
    });
  };

const previewBlocks = useMemo(() => {
  if (!previewMateriaId) return [];
  return comisiones
    .filter(c => c.materiaId === previewMateriaId)
    .flatMap(c =>
      ordenarHorarios(c.horarios).map(h => ({
        dia: h.dia,
        horaEntrada: h.horaEntrada,
        horaSalida: h.horaSalida,
        comisionId: c.comisionId,
        materiaId: c.materiaId,
        disabled: isChocante(c.horarios),
        render: (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '4px',
            fontSize: '0.78rem'
          }}>
            <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
              {h.horaEntrada}
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>{allMaterias.find(m => m.id === c.materiaId)?.nombre}</strong><br />
              Sección {c.seccion}
            </div>
            <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
              {h.horaSalida}
            </div>
          </div>
        )
      }))
    );
}, [previewMateriaId, comisiones, allMaterias, fixedBlocks]);


const onBlockSelect = (blk) => {
  const com = comisiones.find(
    c => c.comisionId === blk.comisionId && c.materiaId === blk.materiaId
  );
  if (!com) return;

  console.log('✅ Fijando comisión', com.seccion, com.materiaId, com.horarios);

const nuevosFijos = com.horarios.map(h => ({
  dia: h.dia,
  horaEntrada: h.horaEntrada,
  horaSalida: h.horaSalida,
  materiaId: com.materiaId,
  comisionId: com.comisionId,
  render: (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      padding: '4px',
      fontSize: '0.78rem'
    }}>
      <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
        {h.horaEntrada}
      </div>
      <div style={{ textAlign: 'center' }}>
        <strong>{allMaterias.find(m => m.id === com.materiaId)?.nombre}</strong><br/>
        Sección {com.seccion}
      </div>
      <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
        {h.horaSalida}
      </div>
    </div>
  )
}));


  setFixedBlocks(prev => [...prev, ...nuevosFijos]);
  setPreviewMateriaId(null);
};


  if (!materiaIds.length) return null;

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
        <Col xs={12} lg={9} style={{ position: 'relative' }}>
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
