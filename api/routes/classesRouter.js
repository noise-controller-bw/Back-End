const { getAllClasses, getClassById, addClass } = require('../helpers');

const router = require('express').Router();

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


module.exports = router;