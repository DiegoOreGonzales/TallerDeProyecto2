// Mock API Interceptor for local deployment without FastAPI backend
const originalFetch = window.fetch;

// Initial Seed Data (matching seed.py)
const INITIAL_CURSOS = [
  { id: 1, codigo: "ASUC01113", nombre: "MATEMÁTICA SUPERIOR", creditos: 5, tipo: "Teoría", periodo: 1 },
  { id: 2, codigo: "ASUC01083", nombre: "HABILIDADES COMUNICATIVAS", creditos: 4, tipo: "Teoría", periodo: 1 },
  { id: 3, codigo: "ASUC01082", nombre: "GESTIÓN DEL APRENDIZAJE", creditos: 3, tipo: "Teoría", periodo: 1 },
  { id: 4, codigo: "ASUC00512", nombre: "INTRODUCCIÓN A LA ING. DE SISTEMAS", creditos: 3, tipo: "Teoría", periodo: 1 },
  { id: 5, codigo: "ASUC01117", nombre: "QUÍMICA 1", creditos: 3, tipo: "Laboratorio", periodo: 1 },
  { id: 6, codigo: "ASUC01108", nombre: "ÁLGEBRA MATRICIAL", creditos: 4, tipo: "Teoría", periodo: 2 },
  { id: 7, codigo: "ASUC01110", nombre: "FUNDAMENTOS DEL CÁLCULO", creditos: 4, tipo: "Teoría", periodo: 2 },
  { id: 8, codigo: "ASUC00562", nombre: "MATEMÁTICA DISCRETA", creditos: 4, tipo: "Teoría", periodo: 2 },
  { id: 9, codigo: "ASUC01160", nombre: "CÁLCULO DIFERENCIAL", creditos: 5, tipo: "Teoría", periodo: 3 },
  { id: 10, codigo: "ASUC01296", nombre: "FÍSICA 1", creditos: 4, tipo: "Teoría", periodo: 3 },
  { id: 11, codigo: "ASUC01312", nombre: "FUNDAMENTOS DE PROGRAMACIÓN", creditos: 4, tipo: "Laboratorio", periodo: 3 },
  { id: 12, codigo: "ASUC01482", nombre: "PROG. ORIENTADA A OBJETOS", creditos: 4, tipo: "Laboratorio", periodo: 4 },
  { id: 13, codigo: "ASUC00316", nombre: "ESTRUCTURA DE DATOS", creditos: 3, tipo: "Laboratorio", periodo: 4 },
  { id: 14, codigo: "ASUC00051", nombre: "BASE DE DATOS", creditos: 4, tipo: "Laboratorio", periodo: 5 },
  { id: 15, codigo: "ASUC01140", nombre: "ARQUITECTURA DEL COMPUTADOR", creditos: 4, tipo: "Teoría", periodo: 6 },
  { id: 16, codigo: "ASUC01386", nombre: "INVESTIGACIÓN OPERATIVA", creditos: 4, tipo: "Teoría", periodo: 6 },
  { id: 17, codigo: "ASUC00947", nombre: "CONSTRUCCIÓN DE SOFTWARE", creditos: 5, tipo: "Laboratorio", periodo: 7 },
  { id: 18, codigo: "ASUC00754", nombre: "REDES DE COMPUTADORES", creditos: 4, tipo: "Laboratorio", periodo: 7 },
  { id: 19, codigo: "ASUC00469", nombre: "INGENIERÍA WEB", creditos: 4, tipo: "Laboratorio", periodo: 9 },
  { id: 20, codigo: "ASUC01585", nombre: "TALLER DE PROYECTOS 2", creditos: 4, tipo: "Laboratorio", periodo: 10 }
];

const INITIAL_AULAS = [
  { id: 1, nombre: "A-101", capacidad: 50, tipo: "Teoría" },
  { id: 2, nombre: "A-102", capacidad: 50, tipo: "Teoría" },
  { id: 3, nombre: "A-201", capacidad: 50, tipo: "Teoría" },
  { id: 4, nombre: "A-202", capacidad: 50, tipo: "Teoría" },
  { id: 5, nombre: "L-101", capacidad: 40, tipo: "Laboratorio" },
  { id: 6, nombre: "L-102", capacidad: 40, tipo: "Laboratorio" },
  { id: 7, nombre: "L-103", capacidad: 40, tipo: "Laboratorio" },
  { id: 8, nombre: "T-101", capacidad: 30, tipo: "Taller" }
];

const INITIAL_DOCENTES = [
  { id: 1, username: "docente_demo", email: "docente@ucontinental.edu.pe", turno_preferido: "COMPLETO" },
  { id: 2, username: "mcastro", email: "mcastro@ucontinental.edu.pe", turno_preferido: "MAÑANA" },
  { id: 3, username: "lperez", email: "lperez@ucontinental.edu.pe", turno_preferido: "TARDE" },
  { id: 4, username: "agarcia", email: "agarcia@ucontinental.edu.pe", turno_preferido: "COMPLETO" },
  { id: 5, username: "vhuaman", email: "vhuaman@ucontinental.edu.pe", turno_preferido: "MAÑANA" }
];

const INITIAL_SECCIONES = [
  { id: 1, codigo: "ASUC01113-M", curso_id: 1, docente_id: 2, capac_estimada: 40, turno: "MAÑANA" },
  { id: 2, codigo: "ASUC01113-T", curso_id: 1, docente_id: 3, capac_estimada: 40, turno: "TARDE" },
  { id: 3, codigo: "ASUC01083-M", curso_id: 2, docente_id: 4, capac_estimada: 35, turno: "MAÑANA" },
  { id: 4, codigo: "ASUC01312-M", curso_id: 11, docente_id: 1, capac_estimada: 30, turno: "MAÑANA" },
  { id: 5, codigo: "ASUC00051-M", curso_id: 14, docente_id: 1, capac_estimada: 45, turno: "MAÑANA" },
  { id: 6, codigo: "ASUC01585-T", curso_id: 20, docente_id: 4, capac_estimada: 25, turno: "TARDE" }
];

const GENERATE_MOCK_HORARIOS = (cursos: any[], aulas: any[], secciones: any[], docentes: any[]) => {
  const result: any[] = [];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  // Create mapping dictionaries
  const cursosMap = new Map(cursos.map(c => [c.id, c]));
  const docentesMap = new Map(docentes.map(d => [d.id, d]));

  // Generate schedule blocks sequentially to avoid collision
  secciones.forEach((sec, idx) => {
    const curso = cursosMap.get(sec.curso_id) || { nombre: "Curso Demo", codigo: "ASUC-DEMO", tipo: "Teoría", periodo: 1, creditos: 4 };
    const doc = docentesMap.get(sec.docente_id) || { username: "Docente Demo" };
    
    // Choose classroom based on course type
    const matchingAulas = aulas.filter(a => a.tipo === curso.tipo);
    const aula = matchingAulas[idx % matchingAulas.length] || aulas[0] || { id: 1, nombre: "Aula Demo", tipo: "Teoría" };
    
    const diaIdx = idx % 6; // Lunes to Sabado
    const isMorning = sec.turno === "MAÑANA";
    // Morning uses slots 0-3; Afternoon uses slots 4-8
    const slotIdx = isMorning ? (idx % 4) : 4 + (idx % 5);

    const timeLabels = [
      { start: "07:00", end: "08:30" },
      { start: "08:35", end: "10:05" },
      { start: "10:10", end: "11:40" },
      { start: "11:45", end: "13:15" },
      { start: "14:00", end: "15:30" },
      { start: "15:35", end: "17:05" },
      { start: "17:10", end: "18:40" },
      { start: "18:45", end: "20:15" },
      { start: "20:20", end: "21:50" }
    ];

    const slotTime = timeLabels[slotIdx];

    result.push({
      seccion_id: sec.id,
      seccion_codigo: sec.codigo,
      aula_id: aula.id,
      dia: diaIdx,
      dia_nombre: dias[diaIdx],
      slot: slotIdx,
      hora_inicio: slotTime.start,
      hora_fin: slotTime.end,
      horas_pedagogicas: [
        { hp: 1, inicio: slotTime.start, fin: "calc" },
        { hp: 2, inicio: "calc", fin: slotTime.end }
      ],
      nombre_curso: curso.nombre,
      nombre_aula: aula.nombre,
      tipo_curso: curso.tipo,
      periodo: curso.periodo,
      creditos: curso.creditos,
      turno_seccion: sec.turno,
      docente_nombre: doc.username,
      codigo_curso: curso.codigo
    });
  });

  return result;
};

// LocalStorage helpers to act as client-side database
const getDB = (key: string, initial: any) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const setDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Global Fetch Interceptor
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const urlStr = input.toString();

  // If the request is not directed to the FastAPI server, pass it through
  if (!urlStr.startsWith('http://localhost:8000')) {
    return originalFetch(input, init);
  }

  // Handle Interception
  console.log(`[MOCK API INTERCEPTOR] Request detected: ${urlStr}`);
  
  // Parse relative route
  const path = urlStr.replace('http://localhost:8000', '');

  // Simulating small network latency (300ms) for high-fidelity feel
  await new Promise(resolve => setTimeout(resolve, 300));

  // 1. AUTH LOGIN
  if (path === '/api/auth/login' && init?.method === 'POST') {
    const body = JSON.parse(init.body as string);
    const { username, password } = body;

    if (username === 'admin' && password === 'admin') {
      return new Response(JSON.stringify({
        access_token: "mock-token-admin",
        user_role: "admin",
        user_name: "Administrador UC",
        user_cycle: null,
        user_shift: "COMPLETO",
        user_career: "ALL"
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (username === 'docente_demo' && password === 'docente') {
      return new Response(JSON.stringify({
        access_token: "mock-token-docente",
        user_role: "docente",
        user_name: "Docente Demo",
        user_cycle: null,
        user_shift: "COMPLETO",
        user_career: "Ingeniería de Sistemas e Informática"
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (username === 'docente_arq' && password === 'docente') {
      return new Response(JSON.stringify({
        access_token: "mock-token-docente-arq",
        user_role: "docente",
        user_name: "Docente Arq. Demo",
        user_cycle: null,
        user_shift: "COMPLETO",
        user_career: "Arquitectura"
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (username.startsWith('estudiante_c') && password === 'ucontinental') {
      const cycleNum = parseInt(username.replace('estudiante_c', ''));
      if (cycleNum >= 1 && cycleNum <= 10) {
        return new Response(JSON.stringify({
          access_token: `mock-token-estudiante-${cycleNum}`,
          user_role: "estudiante",
          user_name: `Estudiante Ciclo ${cycleNum}`,
          user_cycle: cycleNum,
          user_shift: cycleNum % 2 !== 0 ? "MAÑANA" : "TARDE",
          user_career: "Ingeniería de Sistemas e Informática"
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (username.startsWith('estudiante_arq') && password === 'ucontinental') {
      const cycleNum = parseInt(username.replace('estudiante_arq', '')) || 1;
      return new Response(JSON.stringify({
        access_token: `mock-token-estudiante-arq-${cycleNum}`,
        user_role: "estudiante",
        user_name: `Estudiante Arq. Ciclo ${cycleNum}`,
        user_cycle: cycleNum,
        user_shift: cycleNum % 2 !== 0 ? "MAÑANA" : "TARDE",
        user_career: "Arquitectura"
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      detail: "Credenciales incorrectas (Usa: admin/admin, docente_demo/docente, o estudiante_c1/ucontinental)"
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  // 2. COURSES CRUD
  if (path.startsWith('/api/cursos/')) {
    const dbCursos = getDB('mock_cursos', INITIAL_CURSOS);

    if (init?.method === 'POST') {
      const body = JSON.parse(init.body as string);
      const newCurso = {
        id: dbCursos.length > 0 ? Math.max(...dbCursos.map((c: any) => c.id)) + 1 : 1,
        ...body
      };
      dbCursos.push(newCurso);
      setDB('mock_cursos', dbCursos);
      return new Response(JSON.stringify(newCurso), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (init?.method === 'DELETE') {
      const idToDelete = parseInt(path.split('/').filter(Boolean).pop() || '0');
      const filtered = dbCursos.filter((c: any) => c.id !== idToDelete);
      setDB('mock_cursos', filtered);
      return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // GET ALL
    return new Response(JSON.stringify(dbCursos), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 3. CLASSROOMS CRUD
  if (path.startsWith('/api/aulas/')) {
    const dbAulas = getDB('mock_aulas', INITIAL_AULAS);

    if (init?.method === 'POST') {
      const body = JSON.parse(init.body as string);
      const newAula = {
        id: dbAulas.length > 0 ? Math.max(...dbAulas.map((a: any) => a.id)) + 1 : 1,
        ...body
      };
      dbAulas.push(newAula);
      setDB('mock_aulas', dbAulas);
      return new Response(JSON.stringify(newAula), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (init?.method === 'DELETE') {
      const idToDelete = parseInt(path.split('/').filter(Boolean).pop() || '0');
      const filtered = dbAulas.filter((a: any) => a.id !== idToDelete);
      setDB('mock_aulas', filtered);
      return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // GET ALL
    return new Response(JSON.stringify(dbAulas), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 4. TEACHERS CRUD
  if (path.startsWith('/api/auth/users/docentes')) {
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);
    return new Response(JSON.stringify(dbDocentes), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/api/auth/register') && init?.method === 'POST') {
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);
    const body = JSON.parse(init.body as string);
    const newDoc = {
      id: dbDocentes.length > 0 ? Math.max(...dbDocentes.map((d: any) => d.id)) + 1 : 1,
      username: body.username,
      email: body.email,
      turno_preferido: body.turno_preferido || "COMPLETO"
    };
    dbDocentes.push(newDoc);
    setDB('mock_docentes', dbDocentes);
    return new Response(JSON.stringify(newDoc), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/api/auth/users/')) {
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);
    if (init?.method === 'DELETE') {
      const idToDelete = parseInt(path.split('/').filter(Boolean).pop() || '0');
      const filtered = dbDocentes.filter((d: any) => d.id !== idToDelete);
      setDB('mock_docentes', filtered);
      return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // 5. SECTIONS CRUD
  if (path.startsWith('/api/secciones/')) {
    const dbSecciones = getDB('mock_secciones', INITIAL_SECCIONES);
    const dbCursos = getDB('mock_cursos', INITIAL_CURSOS);
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);

    if (init?.method === 'POST') {
      const body = JSON.parse(init.body as string);
      const cursoObj = dbCursos.find((c: any) => c.id === body.curso_id);
      const docenteObj = dbDocentes.find((d: any) => d.id === body.docente_id);

      const newSec = {
        id: dbSecciones.length > 0 ? Math.max(...dbSecciones.map((s: any) => s.id)) + 1 : 1,
        codigo: body.codigo,
        curso_id: body.curso_id,
        docente_id: body.docente_id,
        capac_estimada: body.capac_estimada,
        turno: body.codigo.endsWith('-T') || body.codigo.toLowerCase().includes('tarde') ? 'TARDE' : 'MAÑANA',
        curso: cursoObj ? { nombre: cursoObj.nombre, codigo: cursoObj.codigo, periodo: cursoObj.periodo } : undefined,
        docente: docenteObj ? { username: docenteObj.username } : undefined
      };
      dbSecciones.push(newSec);
      setDB('mock_secciones', dbSecciones);
      return new Response(JSON.stringify(newSec), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (init?.method === 'DELETE') {
      const idToDelete = parseInt(path.split('/').filter(Boolean).pop() || '0');
      const filtered = dbSecciones.filter((s: any) => s.id !== idToDelete);
      setDB('mock_secciones', filtered);
      return new Response(JSON.stringify({ status: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // GET ALL - Map complete relations
    const populated = dbSecciones.map((sec: any) => {
      const cursoObj = dbCursos.find((c: any) => c.id === sec.curso_id);
      const docenteObj = dbDocentes.find((d: any) => d.id === sec.docente_id);
      return {
        ...sec,
        curso: cursoObj ? { nombre: cursoObj.nombre, codigo: cursoObj.codigo, periodo: cursoObj.periodo } : undefined,
        docente: docenteObj ? { username: docenteObj.username } : undefined
      };
    });

    return new Response(JSON.stringify(populated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 6. SCHEDULER STATS
  if (path === '/api/scheduler/stats') {
    const dbCursos = getDB('mock_cursos', INITIAL_CURSOS);
    const dbAulas = getDB('mock_aulas', INITIAL_AULAS);
    const dbSecciones = getDB('mock_secciones', INITIAL_SECCIONES);
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);
    const dbHorarios = getDB('mock_horarios', GENERATE_MOCK_HORARIOS(dbCursos, dbAulas, dbSecciones, dbDocentes));

    return new Response(JSON.stringify({
      cursos: dbCursos.length,
      aulas: dbAulas.length,
      secciones: dbSecciones.length,
      docentes: dbDocentes.length,
      horarios_generados: dbHorarios.length
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 7. GET SCHEDULE
  if (path === '/api/scheduler/') {
    const dbCursos = getDB('mock_cursos', INITIAL_CURSOS);
    const dbAulas = getDB('mock_aulas', INITIAL_AULAS);
    const dbSecciones = getDB('mock_secciones', INITIAL_SECCIONES);
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);
    const dbHorarios = getDB('mock_horarios', GENERATE_MOCK_HORARIOS(dbCursos, dbAulas, dbSecciones, dbDocentes));

    return new Response(JSON.stringify({
      status: "success",
      data: dbHorarios
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // 8. GENERATE SCHEDULE (RUN MATHEMATICAL SOLVER CP-SAT MOCK)
  if (path === '/api/scheduler/generate' && init?.method === 'POST') {
    // Add an extra delay for real computational look
    await new Promise(resolve => setTimeout(resolve, 1500));

    const dbCursos = getDB('mock_cursos', INITIAL_CURSOS);
    const dbAulas = getDB('mock_aulas', INITIAL_AULAS);
    const dbSecciones = getDB('mock_secciones', INITIAL_SECCIONES);
    const dbDocentes = getDB('mock_docentes', INITIAL_DOCENTES);
    
    const freshHorarios = GENERATE_MOCK_HORARIOS(dbCursos, dbAulas, dbSecciones, dbDocentes);
    setDB('mock_horarios', freshHorarios);

    return new Response(JSON.stringify({
      status: "success",
      message: "Horarios optimizados exitosamente con Google OR-Tools CP-SAT.",
      data: freshHorarios
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Fallback for not matched endpoint
  return new Response(JSON.stringify({ detail: "Not Found Mock Endpoint" }), { status: 404 });
};
