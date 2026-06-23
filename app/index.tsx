import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
  frontImage?: string;
  front_shiny?: string;
}

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
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View
          style={{ display: "flex", flexDirection: "row" }}
          key={pokemon.name}
        >
          <Text>{pokemon.name}</Text>
          <Image
            source={{ uri: pokemon.frontImage }}
            style={{
              width: 150,
              height: 150,
            }}
          />
          <Image
            source={{ uri: pokemon.front_shiny }}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
