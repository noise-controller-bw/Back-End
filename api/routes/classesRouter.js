const { getAllClasses, getClassById, addClass } = require('../helpers');

const router = require('express').Router();

//TODO: comments
router.get('/', async (req, res) => {
    try {
        const allClasses = await getAllClasses();
        if (allClasses) {
            return res.status(200).json(allClasses);
        } else {
            res.status(400).send({ message: 'Classes not found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

//TODO: comments
router.get('/:id', (req, res) => {
    getClassById(req.params.id.toString())
      .then(classById => {
        if (classById) {
            res.status(200).json(classById);
          } else {
            res.status(400).json({ message: "There's no class with this id"})
          }
      })
      .catch(err => res.send(err));
});

//TODO: comments
router.post('/', (req, res) => {
    const { name, grade } = req.body;
    if (!name) {
      return res.status(422).json({ error: 'fill out required `name` field!' });
    } else {
      const newClass = { name, grade };
      addClass(newClass)
        .then(resClasses => {
            res.status(201).json(resClasses);
        })
        .catch(error => {
            res.status(500).json(error);
        });
    }
});


module.exports = router;