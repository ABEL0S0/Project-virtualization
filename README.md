# Odontología Dany y Asociados

Sistema de gestión para una clínica odontológica compuesto por un **backend REST en Spring Boot** y un **frontend en React + Vite**, orquestados con Docker Compose. Permite administrar **pacientes**, **fichas técnicas** y **odontogramas** con dibujo sobre canvas.

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Levantar el proyecto con Docker](#levantar-el-proyecto-con-docker)
- [Ejecución local sin Docker](#ejecución-local-sin-docker)
- [Variables de entorno](#variables-de-entorno)
- [API REST](#api-rest)
- [Rutas del frontend](#rutas-del-frontend)
- [Módulos](#módulos)
- [Credenciales por defecto](#credenciales-por-defecto)
- [Almacenamiento de imágenes](#almacenamiento-de-imágenes)
- [Notas y problemas conocidos](#notas-y-problemas-conocidos)

---

## Arquitectura

```
┌──────────────┐    HTTP    ┌──────────────────┐    JDBC    ┌────────────┐
│   Frontend   │ ─────────► │     Backend      │ ─────────► │   MySQL    │
│ React + Vite │ ◄───────── │  Spring Boot 3.4 │ ◄───────── │   8.0      │
│  (nginx)     │            │   Java 17        │            │            │
└──────────────┘            └──────────────────┘            └────────────┘
        :3000                       :8080                        :3309
```

Tres servicios definidos en `docker-compose.yml`:

| Servicio   | Imagen / Build           | Puerto host:cont. | Volumen         |
|------------|--------------------------|-------------------|-----------------|
| `database` | `mysql:8.0`              | `3309:3306`       | `db_data`       |
| `backend`  | build `./backend`        | `8080:8080`       | `images` (`/odontogramas`) |
| `frontend` | build `./frontend`       | `3000:80`         | —               |

---

## Stack tecnológico

### Backend
- **Java 17** (Eclipse Temurin)
- **Spring Boot 3.4.0**
- **Spring Web** (Tomcat embebido)
- **Spring Data JPA** + Hibernate
- **MySQL Connector/J**
- **Lombok**
- **Maven 3.9.9** (incluye wrapper `mvnw`)

### Frontend
- **React 18.3.1**
- **Vite 5.3.4** + plugin SWC
- **React Router DOM 6.25.1**
- **Bootstrap 5.3.3** + **React-Bootstrap 2.10.4**
- **PrimeReact 10.7.0** (tema `lara-light-blue`) + PrimeFlex + PrimeIcons
- **Konva 9.3.14** + **react-konva** (canvas del odontograma)
- **Axios 1.7.2**
- **ESLint 8.57.0**

### Infraestructura
- Docker + Docker Compose v3.8
- Nginx (`stable-alpine`) como servidor estático del frontend

---

## Estructura del proyecto

```
Project-virtualization/
├── docker-compose.yml
├── backend/                          # Spring Boot
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── wait-for-db.sh                # (no usado por el Dockerfile)
│   └── src/main/java/com/exam3p/odontologiaapirestfull/
│       ├── OdontologiaApirestfullApplication.java
│       ├── configuration/AppConfig.java          # bean RestTemplate
│       ├── controller/
│       │   ├── PacienteController.java
│       │   ├── OdontogramaController.java
│       │   └── FichaTecnicaController.java
│       ├── dto/PacienteData.java
│       ├── entity/
│       │   ├── Paciente.java
│       │   ├── Odontograma.java
│       │   └── FichasTecnica.java
│       ├── repository/   (Spring Data JPA)
│       ├── service/      (OdontogramaService, FichaTecnicaService)
│       └── src/main/resources/application.properties
└── frontend/                         # React + Vite
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env / .env.production
    └── src/
        ├── main.jsx
        ├── App.jsx                   # rutas
        ├── components/
        │   ├── Login.jsx / Login.css
        │   ├── Home.jsx
        │   ├── Navbar.jsx
        │   ├── Pacientes.jsx
        │   ├── FichaTecnica.jsx
        │   ├── Odontograma.jsx
        │   └── OdontogramaDetail.jsx # canvas con Konva
        └── assets/                   # imágenes y favicon
```

---

## Requisitos previos

- **Docker** 20.10+ y **Docker Compose** v2 (o v1.29+)
- Para desarrollo local sin contenedores:
  - **JDK 17** y **Maven 3.9+**
  - **Node.js 18+** y **npm 9+**
  - **MySQL 8.0** accesible

---

## Levantar el proyecto con Docker

Desde la raíz del repositorio:

```bash
docker-compose up --build
```

Servicios disponibles una vez levantado:

- Frontend → <http://localhost:3000>
- Backend (API REST) → <http://localhost:8080>
- MySQL → `localhost:3309` (root / root)

Para detener y eliminar contenedores + volúmenes:

```bash
docker-compose down -v
```

---

## Ejecución local sin Docker

### 1. Base de datos

Crear una base de datos MySQL llamada `mydb`. Ajustar las credenciales en
`backend/src/main/resources/application.properties` (por defecto apunta a
`192.168.1.126:3309` con `root` / `root`).

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
# o bien: mvn spring-boot:run
```

Quedará escuchando en <http://localhost:8080>.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite expondrá la app en <http://localhost:5173> (por defecto). El archivo
`frontend/.env` define la URL del backend:

```
VITE_API_URL=http://localhost:8080
```

Para producción local:

```bash
npm run build
npm run preview
```

---

## Variables de entorno

### Frontend

| Archivo               | Variable          | Valor por defecto                  |
|-----------------------|-------------------|------------------------------------|
| `frontend/.env`       | `VITE_API_URL`    | `http://localhost:8080`            |
| `frontend/.env.production` | `VITE_API_URL`| `http://192.168.1.126:8080`        |

Estas variables se leen en los componentes como
`import.meta.env.VITE_API_URL`.

### Backend (definidas en `docker-compose.yml`)

| Variable                       | Valor                                    |
|--------------------------------|------------------------------------------|
| `SPRING_DATASOURCE_URL`        | `jdbc:mysql://database:3306/mydb`        |
| `SPRING_DATASOURCE_USERNAME`   | `root`                                   |
| `SPRING_DATASOURCE_PASSWORD`   | `root`                                   |
| `UPLOAD_DIR`                   | `/odontogramas` *(declarada, no leída por el código Java)* |

### MySQL (`docker-compose.yml`)

| Variable             | Valor   |
|----------------------|---------|
| `MYSQL_ROOT_PASSWORD`| `root`  |
| `MYSQL_DATABASE`     | `mydb`  |
| `MYSQL_USER`         | `admin` |
| `MYSQL_PASSWORD`     | `admin` |

---

## API REST

Base: `http://<host>:8080`. Todos los controllers tienen `@CrossOrigin(origins = "*")`.

### Pacientes — `/pacientes`

| Método | Ruta                          | Descripción                       |
|--------|-------------------------------|-----------------------------------|
| GET    | `/pacientes/list`             | Listar todos los pacientes        |
| GET    | `/pacientes/{id}`             | Obtener paciente por id           |
| POST   | `/pacientes/save`             | Crear paciente                    |
| PUT    | `/pacientes/update/{id}`      | Actualizar paciente               |
| DELETE | `/pacientes/delete/{id}`      | Eliminar paciente                 |

### Odontogramas — `/odontograma`

| Método | Ruta                                  | Descripción                                  |
|--------|---------------------------------------|----------------------------------------------|
| GET    | `/odontograma/lista`                  | Listar todos los odontogramas                |
| GET    | `/odontograma/{id}`                   | Obtener odontograma por id                   |
| GET    | `/odontograma/paciente/{pacienteId}`  | Odontogramas de un paciente                  |
| POST   | `/odontograma/crear`                  | Crear odontograma (verifica paciente)        |
| PUT    | `/odontograma/update/{id}`            | Actualizar odontograma                       |
| DELETE | `/odontograma/delete/{id}`            | Eliminar odontograma                         |
| POST   | `/odontograma/{id}/subirImg`          | Subir imagen (multipart, campo `image`)      |
| GET    | `/odontograma/{id}/imagen`            | Obtener imagen (`image/jpeg`)                |
| PUT    | `/odontograma/{id}/actualizarImg`     | Reemplazar imagen (multipart, campo `image`) |

### Fichas técnicas — `/ficha`

| Método | Ruta                          | Descripción                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/ficha/lista`                | Listar todas las fichas                  |
| GET    | `/ficha/paciente/{pacienteId}`| Fichas de un paciente                    |
| POST   | `/ficha/save`                 | Crear ficha (valida paciente vía REST)   |
| PUT    | `/ficha/update/{id}`          | Actualizar ficha                         |
| DELETE | `/ficha/delete/{id}`          | Eliminar ficha                           |

---

## Rutas del frontend

| Ruta                   | Componente            | Descripción                          |
|------------------------|-----------------------|--------------------------------------|
| `/`                    | `Login`               | Pantalla de acceso                   |
| `/home`                | `Home`                | Menú principal con 3 accesos         |
| `/home/pacientes`      | `Pacientes`           | ABM de pacientes                     |
| `/home/fichas`         | `FichaTecnica`        | Fichas técnicas por paciente         |
| `/home/odontogramas`   | `Odontograma`         | Listado y gestión de odontogramas    |
| (detalle)              | `OdontogramaDetail`   | Dibujo sobre canvas (Konva)          |

---

## Módulos

### Pacientes
ABM completo con los campos: `id`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `telefono`, `correo`.

### Fichas técnicas
Una ficha por paciente contiene: `diagnostico`, `observaciones`, `presupuesto`, `pago`, `fecha_pago` y `tratamientos`. Se agrupan en un acordeón por paciente (Bootstrap).

### Odontogramas
Permite crear varios odontogramas por paciente. Cada uno tiene una imagen (subida por el usuario) y un `descripcion`. El componente `OdontogramaDetail` usa **Konva** para dibujar/sobrescribir la imagen base (`odontograma.png`) con distintos colores y guardar el resultado de vuelta al backend.

---

## Credenciales por defecto

El login está **hardcodeado** en el frontend (`frontend/src/components/Login.jsx`):

```
usuario: admin
contraseña: admin
```

> No existe autenticación real: cualquier request al backend es aceptado gracias a `@CrossOrigin(origins = "*")`. **No usar en producción tal cual.**

---

## Almacenamiento de imágenes

Las imágenes subidas se guardan en el **sistema de archivos del backend**. En el contenedor, la ruta objetivo es `/odontogramas`, expuesta al host mediante el volumen Docker `images`.

- Subida: `POST /odontograma/{id}/subirImg` (multipart, campo `image`)
- Lectura: `GET /odontograma/{id}/imagen`

> **Nota:** el código Java usa una ruta relativa (`odontogramas/`) y no lee la variable `UPLOAD_DIR` declarada en `docker-compose.yml`. Dentro del contenedor termina escribiendo en `/app/odontogramas/`, no en `/odontogramas`. Ver [Notas y problemas conocidos](#notas-y-problemas-conocidos).

---

## Notas y problemas conocidos

1. **Inconsistencia en `UPLOAD_DIR`**: `docker-compose.yml` declara `UPLOAD_DIR=/odontogramas`, pero `OdontogramaService` ignora esa variable y usa `"odontogramas/"` (relativo al CWD del JAR). En el contenedor actual las imágenes se guardan en `/app/odontogramas/`, no en el volumen montado.

2. **URL del servicio de pacientes hardcodeada**: `OdontogramaService` y `FichaTecnicaService` llaman a `http://localhost:8080/pacientes`. Dentro de Docker esto sólo funciona si el cliente está en el host; para que funcione contenedor a contenedor debería ser `http://backend:8080/pacientes`.

3. **`wait-for-db.sh` no se usa**: el script existe en `backend/` pero el `Dockerfile` hace un `sleep 15` fijo. En máquinas lentas o con datos grandes la primera vez puede no alcanzar.

4. **Bug de ruta en `FichaTecnica.jsx`**: el frontend invoca `DELETE /ficha/del/${id}`, pero el backend expone `DELETE /ficha/delete/${id}`. La eliminación de fichas técnicas desde la UI no funciona.

5. **CORS abierto**: todos los controllers usan `@CrossOrigin(origins = "*")`. Aceptable en desarrollo, **no recomendado en producción**.

6. **Login sin seguridad real**: las credenciales están en el frontend. Cualquier persona puede omitir el login accediendo directo a las rutas internas.

7. **CSS muerto en `Navbar.jsx`**: contiene ~700 líneas de CSS demo de PrimeReact (banderas) que no se utilizan.

8. **No hay `README.md` ni `.gitignore` en la raíz** del repositorio (este archivo los provee).

9. **Auto-actualización del esquema**: `spring.jpa.hibernate.ddl-auto=update` modifica la base de datos al arrancar. Útil en desarrollo, peligroso en producción.
