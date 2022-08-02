const { Router } = require("express");
const { Pokemon, Type } = require("../db");
const axios = require("axios");
const {
  allApiData,
  combineDbApi,
  getPokeByName,
  createPokes,
  allDbData,
} = require("../controllers/pokemon");
const e = require("express");
const { getApiTypes } = require("../controllers/Type");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.use(require("body-parser").json());
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/pokemons", async (req, res) => {
  try {
    if (req.query.name) {
      const pokename = await getPokeByName(req.query.name); //need try/catch to work
      if (pokename) {
        return res.status(200).send(pokename);
      }
    } else {
      res.status(200).send(await combineDbApi());
    }
  } catch (error) {
    const pokenamedb = await allDbData()
      .then((r) =>
        r.filter(
          (pokdb) =>
            pokdb.name.toLowerCase().trim() ===
            req.query.name.toLowerCase().trim()
        )
      )
      .then((pok) =>
      pok[0].types.length > 1
          ? [
              {
                id: pok[0].id,
                name: pok[0].name,
                hp: pok[0].hp,
                attack: pok[0].attack,
                defense: pok[0].defense,
                speed: pok[0].speed,
                height: pok[0].height,
                weight: pok[0].weight,
                types: [pok[0].types[0].name, pok[0].types[1].name],
              },
            ]
          : [
              {
                id: pok[0].id,
                name: pok[0].name,
                hp: pok[0].hp,
                attack: pok[0].attack,
                defense: pok[0].defense,
                speed: pok[0].speed,
                height: pok[0].height,
                weight: pok[0].weight,
                
                types: [pok[0].types[0].name]
              },
            ]
      );
    console.log(pokenamedb);
    if (pokenamedb.length > 0) {
      return res.status(200).send(await pokenamedb);
    }
    return res.status(404).send("NO POKEMONS HERE ONLY SOLITUDE");
  }
});

router.get("/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  const allPokes = await combineDbApi();
  try {
    if (id) {
      const pokeID = allPokes.filter((p) => p.id == id);

      pokeID.length
        ? res.status(200).json(pokeID)
        : res.status(404).send("Pokemon not found");
    }
  } catch (err) {
    console.error("error in router /:id" + err);
  }
});

router.post("/pokemons", async (req, res) => {
  const { name, hp, attack, defense, speed, height, weight, types } = req.body;
  const newpoke = await createPokes(
    name,
    hp,
    attack,
    defense,
    speed,
    height,
    weight,
    types
  );
  return res.status(201).json(newpoke);
});

//--------------------------Type----------------------------//

router.get("/types", async (req, res) => {
  return res.status(200).json(await getApiTypes());
});

module.exports = router;
