document.addEventListener("DOMContentLoaded", () => {
  const CLAVE = "agenda_sesion20_v2";
  const $ = id => document.getElementById(id);
  const campos = ['nombre', 'telefono'];
  const mensaje = texto => { $("mensaje").textContent = texto; };
  const leer = () => {
    try { const datos = JSON.parse(localStorage.getItem(CLAVE) || "{}"); return datos && typeof datos === "object" && !Array.isArray(datos) ? datos : {}; }
    catch { return {}; }
  };
  const escribir = datos => localStorage.setItem(CLAVE, JSON.stringify(datos));
  const limpiar = () => campos.forEach(c => $(c).value = "");
  function actualizar() {
    const lista = $("lista"); lista.replaceChildren();
    for (const [nombre, contacto] of Object.entries(leer())) {
      const fila = document.createElement("tr");
      const valores = [nombre, contacto.telefono];
      valores.forEach(valor => { const celda = document.createElement("td"); celda.textContent = valor || ""; fila.appendChild(celda); });
      lista.appendChild(fila);
    }
  }
  $("formulario").addEventListener("submit", e => e.preventDefault());
  $("guardar").addEventListener("click", () => {
    const nombre = $("nombre").value.trim();
    const telefono = $("telefono").value.trim();
    if (!nombre || !telefono) { mensaje("Completa nombre y teléfono."); return; }
    const datos = leer();
    if (Object.hasOwn(datos, nombre)) { mensaje("El contacto ya existe. Usa Modificar o elimina el anterior."); return; }
    datos[nombre] = { telefono};
    try { escribir(datos); limpiar(); actualizar(); mensaje("Contacto guardado correctamente."); }
    catch (error) { mensaje("No se pudo guardar. Revisa los permisos del navegador."); }
  });
  $("buscar").addEventListener("click", () => {
    const nombre = $("nombre").value.trim();
    const contacto = leer()[nombre];
    if (!nombre || !contacto) { mensaje("Contacto no encontrado."); return; }
    $("telefono").value = contacto.telefono;
    mensaje("Contacto encontrado.");
  });
  $("eliminar").addEventListener("click", () => {
    const nombre = $("nombre").value.trim(); const datos = leer();
    if (!Object.hasOwn(datos, nombre)) { mensaje("Contacto no encontrado."); return; }
    delete datos[nombre];
    try { escribir(datos); limpiar(); actualizar(); mensaje("Contacto eliminado."); }
    catch { mensaje("No se pudo eliminar."); }
  });
  $("todos").addEventListener("click", () => {
    if (!Object.keys(leer()).length) { mensaje("La agenda está vacía."); return; }
    if (!confirm("¿Eliminar todos los contactos de esta agenda?")) return;
    try { localStorage.removeItem(CLAVE); limpiar(); actualizar(); mensaje("Agenda vaciada."); }
    catch { mensaje("No se pudo vaciar la agenda."); }
  });
  actualizar();
});
