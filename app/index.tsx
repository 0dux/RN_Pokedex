import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
  frontImage?: string;
  front_shiny?: string;
  types: pokemonType[];
}

interface pokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const fetchPokemons = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=30",
      );

      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const data = await res.json();
          return {
            name: pokemon.name,
            frontImage: data.sprites.front_default,
            front_shiny: data.sprites.front_shiny,
            types: data.types,
          };
        }),
      );
      setPokemons(detailedPokemons);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 20,
        padding: 20,
      }}
    >
      {pokemons.map((pokemon) => (
        <View
          key={pokemon.name}
          style={{
            backgroundColor: colorByType[pokemon.types[0]?.type.name] + 30,
            borderRadius: 40,
          }}
        >
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text
            style={[
              styles.type,
              {
                backgroundColor:
                  colorByType[pokemon.types[0]?.type.name] ?? "#999999",
              },
            ]}
          >
            {pokemon.types[0]?.type.name}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Image source={{ uri: pokemon.frontImage }} style={styles.image} />
            <Image source={{ uri: pokemon.front_shiny }} style={styles.image} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  name: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  image: {
    width: 150,
    height: 150,
  },
  type: {
    fontSize: 22,
    fontWeight: "condensed",
    textAlign: "center",
    color: "white",
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
});
