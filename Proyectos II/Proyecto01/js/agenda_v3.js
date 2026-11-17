document.addEventListener("DOMContentLoaded", () => {
  const CLAVE = "agenda_sesion20_v3";
  const $ = id => document.getElementById(id);
  const campos = ['nombre', 'telefono', 'email', 'direccion'];
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
      const valores = [nombre, contacto.telefono, contacto.email, contacto.direccion];
      valores.forEach(valor => { const celda = document.createElement("td"); celda.textContent = valor || ""; fila.appendChild(celda); });
      lista.appendChild(fila);
    }
  }
  $("formulario").addEventListener("submit", e => e.preventDefault());
  $("guardar").addEventListener("click", () => {
    const nombre = $("nombre").value.trim();
    const telefono = $("telefono").value.trim();
    const email = $("email").value.trim();
    const direccion = $("direccion").value.trim();
    if (!nombre || !telefono || !email || !direccion) { mensaje("Completa todos los campos."); return; }
    const datos = leer();
    if (Object.hasOwn(datos, nombre)) { mensaje("El contacto ya existe. Usa Modificar o elimina el anterior."); return; }
    datos[nombre] = { telefono, email, direccion};
    try { escribir(datos); limpiar(); actualizar(); mensaje("Contacto guardado correctamente."); }
    catch (error) { mensaje("No se pudo guardar. Revisa los permisos del navegador."); }
  });
  $("buscar").addEventListener("click", () => {
    const nombre = $("nombre").value.trim();
    const contacto = leer()[nombre];
    if (!nombre || !contacto) { mensaje("Contacto no encontrado."); return; }
    $("telefono").value = contacto.telefono;
    $("email").value = contacto.email || "";
    $("direccion").value = contacto.direccion || "";
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
  $("modificar").addEventListener("click", () => {
    const nombre = $("nombre").value.trim();
    const telefono = $("telefono").value.trim();
    const email = $("email").value.trim();
    const direccion = $("direccion").value.trim();
    if (!nombre || !telefono || !email || !direccion) { mensaje("Completa todos los campos."); return; }
    const datos = leer();
    if (!Object.hasOwn(datos, nombre)) { mensaje("El contacto no existe. Usa Guardar."); return; }
    datos[nombre] = { telefono, email, direccion };
    try { escribir(datos); actualizar(); mensaje("Contacto modificado correctamente."); }
    catch { mensaje("No se pudo modificar."); }
  });
  actualizar();
});
