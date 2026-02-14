import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedContent from '@/components/AnimatedContent';
import SplitText from '@/components/SplitText';

const GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';

const QUERY = `
  query GetPokemons($limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: {id: asc}) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
    }
  }
`;

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-stone-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-violet-600',
  dark: 'bg-stone-700',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-300',
};

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  stats: { name: string; value: number }[];
}

function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-center bg-muted p-4">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
      <CardContent className="space-y-2 pt-3">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatBar({ name, value }: { name: string; value: number }) {
  const label = name.replace('special-', 'sp.').replace('attack', 'atk').replace('defense', 'def');
  const pct = Math.min((value / 255) * 100, 100);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 text-right uppercase text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right font-mono text-muted-foreground">{value}</span>
    </div>
  );
}

function PokemonCard({ pokemon, index }: { pokemon: Pokemon; index: number }) {
  return (
    <AnimatedContent
      distance={60}
      direction="vertical"
      delay={index * 0.08}
      duration={0.5}
      threshold={0.05}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative flex items-center justify-center bg-muted/50 p-4">
          <span className="absolute right-2 top-1 font-mono text-xs text-muted-foreground">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="h-24 w-24 transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <CardContent className="space-y-2 pt-3">
          <h3 className="text-sm font-semibold capitalize">{pokemon.name}</h3>
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className={`${TYPE_COLORS[type] || 'bg-gray-400'} text-white text-[10px] capitalize border-0`}
              >
                {type}
              </Badge>
            ))}
          </div>
          <div className="space-y-0.5 pt-1">
            {pokemon.stats.slice(0, 4).map((stat) => (
              <StatBar key={stat.name} name={stat.name} value={stat.value} />
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedContent>
  );
}

export default function Pokedex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: QUERY,
          variables: { limit: 24, offset: 0 },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = json.data.pokemon_v2_pokemon;

      const mapped: Pokemon[] = data.map((p: any) => {
        const rawSprites = p.pokemon_v2_pokemonsprites[0]?.sprites;
        const sprites = typeof rawSprites === 'string' ? JSON.parse(rawSprites) : rawSprites || {};
        return {
          id: p.id,
          name: p.name,
          types: p.pokemon_v2_pokemontypes.map((t: any) => t.pokemon_v2_type.name),
          sprite:
            sprites?.other?.['official-artwork']?.front_default ||
            sprites?.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
          stats: p.pokemon_v2_pokemonstats.map((s: any) => ({
            name: s.pokemon_v2_stat.name,
            value: s.base_stat,
          })),
        };
      });

      setPokemons(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const filtered = pokemons.filter(
    (p) =>
      p.name.includes(search.toLowerCase()) ||
      p.types.some((t) => t.includes(search.toLowerCase())) ||
      String(p.id) === search
  );

  return (
    <div className="not-prose space-y-6">
      {/* Title with SplitText animation */}
      <div className="text-center">
        <SplitText
          text="Pokédex"
          tag="h2"
          className="text-3xl font-bold"
          splitType="chars"
          delay={80}
          duration={0.6}
          from={{ opacity: 0, y: 30, rotateX: -40 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
          threshold={0.2}
          rootMargin="-50px"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          GraphQL + shadcn/ui + react-bits 实时演示
        </p>
      </div>

      {/* Search */}
      <AnimatedContent distance={30} direction="vertical" duration={0.4} delay={0.3}>
        <Input
          placeholder="搜索宝可梦名称、属性或编号..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm mx-auto"
        />
      </AnimatedContent>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
          {error}
          <button onClick={fetchPokemons} className="ml-2 underline">
            重试
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <PokemonCardSkeleton key={i} />)
          : filtered.map((pokemon, i) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">没有找到匹配的宝可梦</p>
      )}

      {/* Tech info */}
      <AnimatedContent distance={20} direction="vertical" duration={0.4}>
        <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>数据来源：</strong>
            <a href="https://pokeapi.co/docs/graphql" className="underline ml-1" target="_blank" rel="noopener noreferrer">
              PokeAPI GraphQL
            </a>
          </p>
          <p>
            <strong>使用组件：</strong> shadcn/ui (Card, Badge, Input, Skeleton) · react-bits (SplitText, AnimatedContent)
          </p>
        </div>
      </AnimatedContent>
    </div>
  );
}
