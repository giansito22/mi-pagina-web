document.addEventListener("DOMContentLoaded", () => {
  const CLAVE = "agenda_sesion20_v1";
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
      const fila = document.createElement("li");
      fila.textContent = `${nombre} - ${contacto.telefono}`;
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
  $("recuperar").addEventListener("click", () => { actualizar(); mensaje(Object.keys(leer()).length ? "Contactos recuperados." : "No hay contactos guardados."); });
  actualizar();
});
