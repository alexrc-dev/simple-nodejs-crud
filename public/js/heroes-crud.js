/*Obtencion de Heroes*/

const heroes = [];
addEventListener('load', actualizarListaHeroes); // Obtener todo desde la api cuando se cargue la pagina

function obtenerHeroesDelServidor() {
    let req = new XMLHttpRequest(); // Consultar https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    const listaHeroes = document.getElementById('#listaHeroes');
    req.addEventListener('load', (respuesta) => {
        let response = JSON.parse(req.responseText);
        for (const hero of response) {
            heroes.push(hero);
            listaHeroes.innerHTML += heroeItemHTML(hero);
        }
    });
    req.open("GET", "/api/heroes");
    req.send();

}

function actualizarListaHeroes() {
    heroes.splice(0, heroes.length); // Se puede experimentar comentando esta linea
    document.getElementById('#listaHeroes').innerHTML = ""; // Se puede experimentar comentando esta linea
    obtenerHeroesDelServidor();
}

/* Agregar Heroes*/

function validarDatosDeEntrada(nombre, descripcion) { // Bien se pueden hacer mas validaciones
    if (nombre === '')
        return "El nombre no debe ir vacio";
    else if (nombre.length < 4)
        return "El nombre debe tener minimo 4 caracteres";

    if (descripcion === '')
        return "La descripcion no debe estar vacia.";
    return false; // Si no hay errores devolver falso.
}

function cancelarEdicion() { // Bien podria llamarse 'cancelarAgregacion'
    const nombreCampo = document.getElementById('#nombre-campo');
    const descripcionCampo = document.getElementById('#descripcion-campo');
    const errorText = document.getElementById("#error-text");
    errorText.innerText = '';
    nombreCampo.value = '';
    descripcionCampo.value = '';
    $('#addModal').modal('hide');
}

function agregarHeroeEnServidor() {
    let req = new XMLHttpRequest();
    const nombreCampo = document.getElementById('#nombre-campo');
    const descripcionCampo = document.getElementById('#descripcion-campo');
    const errorText = document.getElementById("#error-text");
    let error = validarDatosDeEntrada(nombreCampo.value, descripcionCampo.value);
    if (error) {
        errorText.innerText = error;
        return;
    }
    req.addEventListener('load', () => {
        cancelarEdicion();
        actualizarListaHeroes()
    });
    req.open("POST", '/api/heroes');
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let body = new FormData();
    body.append("nombre", nombreCampo.value);
    body.append("descripcion", descripcionCampo.value);
    let data = '';
    body.forEach((valor, clave) => data += `${clave}=${valor}&`)
    req.send(data);
}

/* Edicion de Heroes*/

function guardarCambiosEnServidor(id) {
    let req = new XMLHttpRequest();
    const nombreCampo = document.getElementById('#nombre-campo-editar');
    const descripcionCampo = document.getElementById('#descripcion-campo-editar');
    const errorText = document.getElementById("#error-text-edit");
    let error = validarDatosDeEntrada(nombreCampo.value, descripcionCampo.value);
    console.log('Holla');
    if (error) {
        errorText.innerText = error;
        return;
    }
    console.log('Holla2');

    req.addEventListener('load', () => {
        cancelarEdicionHeroe();
        actualizarListaHeroes();
    });
    req.open("PATCH", '/api/heroes/' + id);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let body = new FormData();
    body.append("nombre", nombreCampo.value);
    body.append("descripcion", descripcionCampo.value);
    let data = '';
    body.forEach((valor, clave) => data += `${clave}=${valor}&`)
    req.send(data);
}

function cancelarEdicionHeroe() {
    const nombreCampo = document.getElementById('#nombre-campo-editar');
    const descripcionCampo = document.getElementById('#descripcion-campo-editar');
    const errorText = document.getElementById("#error-text-edit");
    const botonGuardar = document.getElementById("guardar-cambios-edicion");
    // botonGuardar.onclick = null;
    errorText.innerText = '';
    nombreCampo.value = '';
    descripcionCampo.value = '';
    $('#editModal').modal('hide');
}

function abrirEdicionHeroe(id) {
    let heroe = heroes.find(h => h.id === id);
    $('#editModal').modal('show');
    const botonGuardar = document.getElementById("guardar-cambios-edicion");
    botonGuardar.setAttribute('onclick', `guardarCambiosEnServidor(${heroe.id})`);
    document.getElementById('#nombre-campo-editar').value = heroe.nombre;
    document.getElementById('#descripcion-campo-editar').value = heroe.descripcion;
    document.getElementById('editModalLabel').innerText = `Editar ${heroe.nombre}`;
}

/* Eliminacion de Heroes*/

function cancelarEliminacion() {
    $('#deleteModal').modal('hide');
    document.getElementById('eliminarMensaje').innerText = '';
    // document.getElementById('eliminar-heroe-servidor').onclick = null;
}

function eliminarHeroeEnServidor(id) {
    let req = new XMLHttpRequest();
    req.addEventListener('load', () => {
        cancelarEliminacion();
        actualizarListaHeroes()
    });
    req.open("DELETE", '/api/heroes/' + id);
    req.send();
}

function abrirConfirmacionEliminarHeroe(id) {
    let heroe = heroes.find(h => h.id === id);
    $('#deleteModal').modal('show');
    document.getElementById('eliminarMensaje').innerText = `Esta seguro que quiere eliminar a ${heroe.nombre}`;
    document.getElementById('eliminar-heroe-servidor').setAttribute('onclick', `eliminarHeroeEnServidor(${heroe.id})`);
}

/* Plantillas */

function heroeItemHTML(heroe) {
    return `
        <div class="col" style="margin-bottom: 10px; margin-top: 10px">
                <div class="card" style="width: 18rem">
                    <div class="card-body">
                        <h5 class="card-title">${heroe.nombre}</h5>
                        <p class="card-text">${heroe.descripcion}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn material-icons text-danger" title="Eliminar" onClick="abrirConfirmacionEliminarHeroe(${heroe.id})">delete</button>
                        <button class="btn material-icons text-warning" title="Editar" onClick="abrirEdicionHeroe(${heroe.id})">edit</button>
                    </div>
                </div>
            </div>
    `
}