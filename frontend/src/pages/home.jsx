import React, { useState, useMemo } from "react";
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
// import { useMaterias } from "../hooks/useMaterias";
import { materiasMock } from "../mocks/materiasMocks";

export default function Home() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [selectedIds, setSelectedIds]   = useState([]);
  const [selectedCuatri, setSelectedCuatri] = useState(1);
  const navigate = useNavigate();

  // const { data: materias, isLoading, isError, error } = useMaterias();
  const materias  = materiasMock;
  const isLoading = false;
  const isError   = false;

  
  const filteredMaterias = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return materias.filter(
      (m) =>
        m.nombre.toLowerCase().includes(term) ||
        m.codigo.toLowerCase().includes(term)
    );
  }, [searchTerm, materias]);

  const selectedMaterias = materias.filter((m) =>
    selectedIds.includes(m.id)
  );

  const handleCheck = (e) => {
    const id = Number(e.target.value);
    setSelectedIds((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleRemove = (id) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedIds.length) return;
    const qMat = selectedIds.join(",");
    navigate(`/armar?materiaIds=${qMat}&cuatri=${selectedCuatri}`);
  };

  return (
    <Container className="py-4">
      <h1>Bienvenido a Cruma</h1>
      <h2 className="mb-4">Selecciona las materias que vas a cursar</h2>

      {isLoading && <Spinner animation="border" />}
      {isError && (
        <Alert variant="danger">Error cargando materias</Alert>
      )}

      {!isLoading && !isError && (
        <Form onSubmit={handleSubmit}>
          
          <Row className="mb-3 align-items-center">
            <Col xs="auto">Cuatrimestre:</Col>
            <Col>
              <ButtonGroup>
                {[1, 2].map((n) => (
                  <Button
                    key={n}
                    variant={selectedCuatri === n ? "primary" : "outline-primary"}
                    onClick={() => setSelectedCuatri(n)}
                  >
                    {n}
                  </Button>
                ))}
              </ButtonGroup>
            </Col>
          </Row>

          <Row>
            {/* Buscador y resultados */}
            <Col md={8}>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Buscar materias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text>🔍</InputGroup.Text>
              </InputGroup>

              {searchTerm.trim() === "" ? (
                <p className="text-muted">Empieza a escribir para buscar materias.</p>
              ) : filteredMaterias.length === 0 ? (
                <p className="text-muted">No hay materias que coincidan.</p>
              ) : (
                filteredMaterias.map((m) => (
                  <Form.Check
                    key={m.id}
                    type="checkbox"
                    id={`materia-${m.id}`}
                    label={`${m.codigo} – ${m.nombre} (Nivel ${m.nivel})`}
                    value={m.id}
                    checked={selectedIds.includes(m.id)}
                    onChange={handleCheck}
                  />
                ))
              )}
            </Col>

            {/* Panel de seleccionadas */}
            <Col md={4}>
              <h5>Seleccionadas</h5>
              {selectedMaterias.length === 0 ? (
                <p className="text-muted">No has seleccionado ninguna.</p>
              ) : (
                <ListGroup>
                  {selectedMaterias.map((m) => (
                    <ListGroup.Item
                      key={m.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        ✅ {m.codigo} – {m.nombre}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemove(m.id)}
                      >
                        ×
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
          </Row>

          <Button
            type="submit"
            disabled={selectedIds.length === 0}
            className="mt-3"
          >
            Armar Cronograma
          </Button>
        </Form>
      )}
    </Container>
  );
}
