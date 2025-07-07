# Sistema de Selección de Horarios de Cursado

> Aplicación web para que alumnos armen y gestionen su cronograma de cursado, seleccionando materias y comisiones sin solapamientos.

---

## 📝 Descripción

Este proyecto permite a los estudiantes:

* Visualizar el catálogo de materias y sus comisiones disponibles.
* Consultar y filtrar horarios por cuatrimestre y carrera.
* Armar un cronograma personalizado, evitando solapamientos.
* Exportar e importar horarios en formato Excel.

La solución está dividida en **backend** (Java + Spring Boot + JPA) y **frontend** (React/Angular).

---

## 🚀 Funcionalidades principales

1. **CRUD de Materias y Comisiones**
2. **Catálogo de horarios** 
3. **Armado de cronograma**
4. **Exportación/Importación**
5. **Autenticación**

---

## 📦 Tech Stack

* **Backend**: Java 11+, Spring Boot, Spring Data JPA, Maven
* **Base de datos**: PostgreSQL (configurable)
* **Frontend**: React (o Angular) + TypeScript + TailwindCSS
* **Scripts**: Python (pdfplumber) para extracción de horarios

---

## 🛠️ Requisitos previos

* Java 11 o superior
* Maven 3.6+
* Node.js 14+ y npm/yarn
* Python 3.8+ (para scripts de extracción)
* Git & GitHub CLI (opcionales pero recomendados)

---

## 🔧 Instalación y puesta en marcha

1. Clonar el repositorio:

   ```bash
   git clone git@github.com:tu-usuario/sistema-gestion-horarios.git
   cd sistema-gestion-horarios
   ```

2. Configurar variables de entorno (backend):

   ```bash
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/horarios
   export SPRING_DATASOURCE_USERNAME=tu_usuario
   export SPRING_DATASOURCE_PASSWORD=tu_contraseña
   ```

3. Iniciar backend:

   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

4. Iniciar frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

5. (Opcional) Ejecutar script de extracción de horarios:

   ```bash
   cd scripts
   python extract_horarios.py --input ../data/horarios.pdf --output ../data/horarios.xlsx
   ```

6. Abrir en el navegador:

   ```
   ```

[http://localhost:3000](http://localhost:3000)

````(o

---

## 🌿 Estructura de ramas

- **main**: rama estable, sólo merges vía PR tras pasar CI y revisión.
- **dev**: integración de features, también protegida.
- **feature/**: nuevas funcionalidades, parten de `dev`.
- **bugfix/**: correcciones, parten de `dev`.

---

## 🤝 Contribuciones

1. Haz un fork del repositorio
2. Crea una rama con tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commits claros
4. Empuja tu rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request en GitHub y asigna revisores

---

## 📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores
- **Tu Nombre** – GitHub: [tu-usuario](https://github.com/tu-usuario)
- **Compañero/a** – GitHub: [otro-usuario](https://github.com/otro-usuario)

---

> ¡Bienvenidos a bordo! 🚀  
> Cualquier duda o sugerencia, abre un issue y lo discutimos.")```

````
