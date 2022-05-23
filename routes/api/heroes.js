const express = require('express');
const router = express.Router();

/* Endpoints o servicios que queremos que nuestro servidor tenga.*/

let heroes = [ // Se puede reemplazar con una lectura a una BD
    {
        nombre: 'Iron Man',
        descripcion: 'Iron Man es un superhéroe que aparece en los cómics estadounidenses publicados por Marvel Comics.'
    }
]

router.get('/', function (req, res, next) { // Listar todos los registros en formato JSON
    res.json(heroes.map((hero, i) => ({...hero, id: i}))); // Aqui se colocal el campo 'id' con el indice del elemento en el array
});
router.get('/:id', function (req, res, next) { // Se obtiene por id un registro y se devuelve en JSON
    const hero_id = req.params.id;
    res.json({...heroes[hero_id], id: hero_id}); // Aqui se colocal el campo 'id' con el indice del elemento en el array
});
router.post('/', function (req, res) { // Servicio para agregar un nuevo registro
    heroes.push({nombre: req.body.nombre, descripcion: req.body.descripcion})
    res.status(204).send();
});

router.patch('/:id', function (req, res) { // Servicio para editar un registro existente
    console.log('Patch', req.params);
    const hero_id = req.params.id;

    heroes[hero_id] = {nombre: req.body.nombre, descripcion: req.body.descripcion};

    res.status(204).send();
});

router.delete('/:id', function (req, res) { // Servicio para eliminar un registro existente
    const hero_id = req.params.id;
    heroes.splice(hero_id, 1);
    res.status(204).send();
});

module.exports = router;
