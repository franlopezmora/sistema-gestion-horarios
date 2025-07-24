import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  ListGroup,
  InputGroup,
  ButtonGroup
} from "react-bootstrap";
import { materiasMock } from "../mocks/materiasMocks";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCuatri, setSelectedCuatri] = useState(null);
  const navigate = useNavigate();

  // 🔥 Cambia esto cuando uses tu hook real
  const materias = materiasMock;
  const isLoading = false;
  const isError = false;

  // 🔎 Filtrar materias en base al término de búsqueda
  const filteredMaterias = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return materias.filter(
        (m) =>
            m.nombre.toLowerCase().includes(term) ||
            m.codigo.toLowerCase().includes(term)
    );
  }, [searchTerm, materias]);

  const selectedMaterias = useMemo(
      () => materias.filter((m) => selectedIds.includes(m.id)),
      [materias, selectedIds]
  );

  const handleCheck = useCallback((e) => {
    const id = Number(e.target.value);
    setSelectedIds((prev) =>
        e.target.checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  }, []);

  const handleRemove = useCallback((id) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        if (!selectedIds.length) return;
        const qMat = selectedIds.join(",");
        navigate(`/armar?materiaIds=${qMat}&cuatri=${selectedCuatri}`);
      },
      [selectedIds, selectedCuatri, navigate]
  );

  return (
      <Container className="py-4">
        <h1 className="mb-3">🎓 Bienvenido a Cruma</h1>
        <h2 className="mb-4">Selecciona las materias que vas a cursar</h2>

        {isLoading && <Spinner animation="border" />}
        {isError && <Alert variant="danger">⚠️ Error cargando materias</Alert>}

        {!isLoading && !isError && (
            <Form onSubmit={handleSubmit}>
              {/* Selector de cuatrimestre */}
              <Row className="mb-3 align-items-center">
                <Col xs="auto">
                  <strong>Cuatrimestre:</strong>
                </Col>
                <Col>
                  <ButtonGroup style={{ marginBottom: "30px" }}>
                    {[1, 2].map((n) => (
                        <Button
                            key={n}
                            variant={
                              selectedCuatri === n ? "primary" : "outline-primary"
                            }
                            onClick={() => setSelectedCuatri(n)}
                        >
                          {n}
                        </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>

              {selectedCuatri === null && (
                  <p className="text-muted">
                    ⚠️ Primero selecciona un cuatrimestre para ver las materias.
                  </p>
              )}

              {/* Buscador y listado */}
              {selectedCuatri !== null && (
              <Row>
                <Col md={8}>
                  <InputGroup className="mb-2">
                    <Form.Control
                        style={{ borderRadius: "50px", width: "250px", height: "30px", textAlign: "center" }}  // píldora
                        placeholder="Buscar materias por código o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <InputGroup.Text role="img" aria-label="buscar" style={{ marginLeft: "3px", fontSize: "25px" }} >
                      🔍
                    </InputGroup.Text>
                  </InputGroup>

                  <div className="mt-3" style={{ padding: "10px" }}>
                    {/* ✅ Si no se escribió nada */}
                    {searchTerm.trim() === "" && (
                        <p className="text-muted">⌨️ Empieza a escribir para buscar materias.</p>
                    )}

                    {/* ✅ Si se escribió pero no hay resultados */}
                    {searchTerm.trim() !== "" && filteredMaterias.length === 0 && (
                        <p className="text-muted">❌ No hay materias que coincidan.</p>
                    )}

                    {/* ✅ Si hay resultados */}
                    {searchTerm.trim() !== "" && filteredMaterias.length > 0 && (
                        <>
                          {filteredMaterias.map((m) => (
                              <Form.Check
                                  key={m.id}
                                  type="checkbox"
                                  id={`materia-${m.id}`}
                                  label={`${m.codigo} – ${m.nombre} (Nivel ${m.nivel})`}
                                  value={m.id}
                                  checked={selectedIds.includes(m.id)}
                                  onChange={handleCheck}
                                  style={{marginTop: "10px"}}
                              />
                          ))}
                        </>
                    )}
                  </div>
                </Col>

                {/* Panel lateral de seleccionadas */}
                {/* ✅ Mostrar solo si hay materias seleccionadas */}
                {selectedMaterias.length > 0 && (
                    <>
                      <h2 style={{marginTop: "50px"}}>📌 Seleccionadas</h2>
                      <ListGroup>
                        {selectedMaterias.map((m) => (
                            <ListGroup.Item
                                key={m.id}
                                className="d-flex justify-content-between align-items-center"
                                style={{ minHeight: "50px" }}
                            >
                              <span>
                                ✅ {m.codigo} – {m.nombre}
                              </span>
                              <Button
                                  variant="outline-danger"
                                  size="sm"
                                  style={{
                                    padding: "6px 6px",
                                    fontSize: "1rem",
                                    marginLeft: "8px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    lineHeight: 1
                                  }}
                                  onClick={() => handleRemove(m.id)}
                              >
                                ❌
                              </Button>
                            </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                )}
              </Row>
              )}

              {/* Botón final */}
              {selectedCuatri != null && searchTerm !== "" && selectedIds.length > 0 &&  (
              <Button
                  type="submit"
                  disabled={selectedIds.length === 0 || searchTerm === "" || selectedIds.length === 0}
                  className="mt-4"
                  style={{ padding: "20px", marginTop: "20px" }}
              >
                🚀 Armar Cronograma
              </Button>
              )}
            </Form>
        )}
      </Container>
  );
}
