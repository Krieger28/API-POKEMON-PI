const { Pokemon, Type } = require("../db");
const axios = require("axios");

const allApiData = async () => {
  try {
    const apidata = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=43"
    );
    const apilinks = apidata.data.results.map((p) => {
      return p.url;
    });

    const infourls = await axios.all(apilinks.map((links) => axios.get(links)));
    let pokemons = infourls.map((p) => {
      return {
        id: p.data.id,
        name: p.data.name,
        hp: p.data.stats[0].base_stat,
        attack: p.data.stats[1].base_stat,
        defense: p.data.stats[2].base_stat,
        speed: p.data.stats[5].base_stat,
        height: p.data.height,
        weight: p.data.weight,
        sprite: p.data.sprites.other["official-artwork"].front_default,
        types:
          p.data.types.length < 2
            ? [p.data.types[0].type.name]
            : [p.data.types[0].type.name, p.data.types[1].type.name],
      };
    });
    return pokemons;
  } catch (err) {
    console.error("Error in the controller allApiData " + err);
  }
};

const allDbData = async () => {
  try {
    return await Pokemon.findAll({
      include: {
        model: Type,
        props: ["name"],
        through: {
          props: [],
        },
      },
    });
  } catch (err) {
    console.error("allDbData " + err);
  }
};

const combineDbApi = async () => {
  const apidata = await allApiData();
  const dbdata = await allDbData();
  const alldata = [...apidata, ...dbdata]; //apidata.concat(dbdata)
  return alldata;
};

const getPokeByName = async (name) => {
  const nicename = name.toLowerCase().trim();
  const pokedata = await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${nicename}`)
    .then((poke) => poke.data);
  if (pokedata) {
    console.log(pokedata);
    const poke = [];
    poke.push(pokedata);
    return poke.map((p) => {
      return {
        id: p.id,
        name: p.name,
        hp: p.stats[0].base_stat,
        attack: p.stats[1].base_stat,
        defense: p.stats[2].base_stat,
        speed: p.stats[5].base_stat,
        height: p.height,
        weight: p.weight,
        sprite: p.sprites.other["official-artwork"].front_default,
        types:
          p.types.length < 2
            ? [p.types[0].type.name]
            : [p.types[0].type.name, p.types[1].type.name],
      };
    });
  } else {
    console.log("este es el else! :" + name);
    return name;
  }
};

const createPokes = async (
  name,
  hp,
  attack,
  defense,
  speed,
  height,
  weight,
  types
) => {
  try {
    const newPokemon = await Pokemon.create({
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
    });

    await Type.findAll({
      where: {
        name: types,
      },
    }).then((res) => newPokemon.addType(res));

    return "Your Pokemon was created!";
  } catch (err) {
    console.error("error in creating pokemon " + err);
  }
};

module.exports = {
  allApiData,
  allDbData,
  combineDbApi,
  getPokeByName,
  createPokes,
};
