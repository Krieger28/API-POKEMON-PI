const { Pokemon, Type } = require("../db");
const axios = require("axios");

const allApiTypes = async () => {
  try {
    const pokeTypesData = await axios.get("https://pokeapi.co/api/v2/type");
    
    const pokeTypes = pokeTypesData.data.results;
    pokeTypes.map(({ name }) => {
      Type.create({
        name,
      });
    });
  } catch (err) {
    console.log(err);
  }
};
allApiTypes();


const getApiTypes = async () => {
    const types = await Type.findAll();
    return types;
}

module.exports = {
  getApiTypes,
};
