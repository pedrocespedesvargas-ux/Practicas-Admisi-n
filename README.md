# Portal de prácticas de admisión

Hecho por Ing. Pedro Céspedes V

Abre `index.html` después de descomprimir el ZIP. Incluye HTML, CSS, JavaScript, imágenes y los PDF originales. Las prácticas funcionan sin Node.js, compilación ni instalación. El contador global y la descarga desde el sitio publicado necesitan internet.

| Práctica | Preguntas | Distribución |
| --- | ---: | --- |
| LEBS 2026 | 55 | 40 de lectura y 15 analogías |
| LEBS Digital | 40 | 20 de lectura y 20 analogías |
| LEBS ORD-24 | 55 | 40 de lectura y 15 analogías |
| Científicos 2019–2020 | 80 | 47 matemática y 33 verbal |
| Científicos 2021–2022 | 80 | 47 matemática y 33 verbal |
| Científicos 2022–2023 | 80 | 47 matemática y 33 verbal |
| Científicos 2025–2026 | 80 | 50 matemática y 30 verbal |

Total: 470 preguntas. Cada práctica tiene navegación, comprobación, explicación y resultado. Los folletos históricos no se presentan como el formato vigente de admisión. Se conservaron las claves anteriores de las dos primeras prácticas.

## Publicar en GitHub Pages

1. Sube todo el contenido descomprimido a la raíz de tu repositorio, con `index.html` en esa raíz; conserva nombres y carpetas.
2. En Settings → Pages selecciona Deploy from a branch, rama main, carpeta /(root).
3. Abre el enlace de GitHub Pages cuando termine la publicación.

Las rutas de las prácticas y recursos son relativas y admiten subcarpetas de repositorios. `.nojekyll` está incluido. No subas únicamente el archivo ZIP.

## Respuestas y avance

Todas las prácticas guardan en localStorage las selecciones, preguntas comprobadas, ubicación y pantalla de resultados. Cada práctica usa una clave independiente. El menú muestra “Continuar práctica” cuando hay respuestas guardadas. “Practicar de nuevo” reinicia solo esa práctica.

El avance pertenece a ese navegador y ese origen: no se sincroniza con otro dispositivo ni se envía al contador. Borrar datos del navegador elimina el progreso. Al cambiar entre el sitio publicado, una copia local y GitHub Pages, cada origen conserva su propio avance. Si el navegador bloquea el almacenamiento, se muestra un aviso. Las ventanas privadas pueden eliminarlo al cerrarse.

## Contador compartido

El contador consulta `https://practica-lebs-digital.pedrocv.chatgpt.site/api/visitas`. También funciona desde GitHub Pages mientras ese servicio siga disponible. El total comienza con esta actualización: no se inventan visitas anteriores.

Cuenta sesiones de visita, no personas únicas. Se reutiliza un identificador aleatorio durante 30 minutos para que pasar del menú a una práctica o recargar no incremente el contador. No almacena nombres, direcciones IP ni respuestas. El servidor conserva identificador de sesión y fecha. Si no hay conexión o falla el servicio, muestra “No disponible”; los ejercicios siguen funcionando. Si ambos almacenamientos del navegador están bloqueados, consulta el total sin crear una sesión nueva.

## Descargar

El botón solicita el PIN `12326` cada vez. Después de validarlo, pulsa **Guardar ZIP**: un enlace visible abre la descarga en otra pestaña. Un PIN incorrecto no habilita ese enlace. Es un control del botón implementado en JavaScript; no constituye autenticación fuerte y el enlace directo al ZIP sigue disponible. La copia descargada apunta al ZIP del sitio original para futuras descargas y no incluye otra copia del ZIP dentro de sí misma.

## Agregar prácticas

Crea una carpeta dentro de `practicas/` con HTML, CSS, JavaScript e imágenes. Agrega su entrada al arreglo de `practicas.js`, usando un id único y la ruta `./practicas/mi-practica/index.html`. Puedes usar `lectura` y `analogias`, o `areas: [{titulo:"de matemática",cantidad:50},{titulo:"de razonamiento verbal",cantidad:30}]`. El catálogo y el buscador se actualizan automáticamente. Incluye un enlace `../../index.html` para volver al menú.

## Criterios de corrección

Cada PDF original está en `fuente/` dentro de su práctica. Los campos `officialAnswer` y `answer` de los folletos científicos distinguen la clave impresa de la respuesta razonada; los índices 0–3 corresponden a A–D. `acceptedAnswers` permite alternativas defendibles y `answer:null` excluye un ítem de la nota. Las discrepancias se explican al comprobar; no son modificaciones oficiales del folleto.

- ORD-24 no trae clave oficial: se usa una clave razonada; el ítem 9 no se califica y el 46 acepta A/C. Se califican 54.
- Científicos 2019–2020: el 46 tiene datos incompatibles y no se califica; el 71 acepta B/C. Se corrigen 8,38,59,75,77 respecto de la tabla. Se califican 79.
- Científicos 2021–2022: se corrigen 8,42,43,59 respecto de la tabla. El 50 acepta A/D y el 69 A/B/C. En el 27 se advierte la errata del primer término. Se califican 80.
- Científicos 2022–2023: se corrigen 8,21,42,43,58,60,61,62 respecto de la tabla. El 21 acepta A/B, el 50 A/D y el 69 A/B/C. El 60 rotula las opciones e–h en el PDF; aquí se ordenan A–D. Se califican 80.
- Científicos 2025–2026: se corrigen 42,70,71 respecto de la tabla; el 55 no ofrece un sinónimo válido de baremo y se excluye. El 51 acepta A/D y el 78 B/C. Se califican 79.

Las figuras se extraen de los PDF y pueden ampliarse. Se transcriben fórmulas y se conservan subrayados relevantes. En el texto sobre protoplasma se advierte que el símbolo del magnesio es Mg, aunque el original diga Mn.

## Verificación

Se comprobaron las siete aplicaciones con recorridos completos, respuestas correctas e incorrectas, resultados, reinicio, restauración tras recargar y almacenamiento bloqueado. Se verificaron rutas, recursos, claves independientes, PIN, búsqueda y el contador con sesiones duplicadas y diferentes. Las figuras se inspeccionaron frente a los PDF. No se realizó una revisión visual completa en un navegador.
