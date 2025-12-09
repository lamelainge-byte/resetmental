(() => {

  const btnAumentar = document.querySelector("#aumentarFuente");
  const btnDisminuir = document.querySelector("#disminuirFuente");
  const btnContraste = document.querySelector("#contraste");

  let tamañoFuente = 16; // Tamaño base de la fuente
  let contrasteActivo = false;

  if (btnAumentar && btnDisminuir && btnContraste) {

    btnAumentar.addEventListener("click", () => {
      if (tamañoFuente < 24) {
        tamañoFuente += 1; //acumulador
        // Aplicar a todo el documento
        document.documentElement.style.fontSize = `${tamañoFuente}px`; //documentElement : documento ruta (html)
      }
    });

    btnDisminuir.addEventListener("click", () => {
      if (tamañoFuente > 12) {
        tamañoFuente -= 1;
        // Aplicar a todo el documento
        document.documentElement.style.fontSize = `${tamañoFuente}px`; //documentElement : documento ruta (html)
      }
    });

    btnContraste.addEventListener("click", () => {
      contrasteActivo = !contrasteActivo; //active
      if (contrasteActivo) {
        document.body.classList.add("modo-contraste"); //se agrega la clase modo-contraste al body (todo lo que lo tenga)
      } else {
        document.body.classList.remove("modo-contraste"); //se quita la clase 
      }
    });
  }
})();
