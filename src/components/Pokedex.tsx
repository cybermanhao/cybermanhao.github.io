import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedContent from '@/components/AnimatedContent';
import SplitText from '@/components/SplitText';

const GRAPHQL_ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta';
const PAGE_SIZE = 24;

const LOCALE_MAP: Record<string, string> = {
  zh: 'zh-Hans', en: 'en', ja: 'ja', es: 'es',
};
const LOCALE_LABELS: Record<string, string> = {
  zh: '中文', en: 'EN', ja: '日本語', es: 'ES',
};

const ALL_TYPES = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'] as const;
type PkType = typeof ALL_TYPES[number];

const TYPE_I18N: Record<PkType, Record<string, string>> = {
  normal:   { 'zh-Hans': '一般',   en: 'Normal',   ja: 'ノーマル',   es: 'Normal'    },
  fire:     { 'zh-Hans': '火',     en: 'Fire',     ja: 'ほのお',     es: 'Fuego'     },
  water:    { 'zh-Hans': '水',     en: 'Water',    ja: 'みず',       es: 'Agua'      },
  electric: { 'zh-Hans': '电',     en: 'Electric', ja: 'でんき',     es: 'Eléctrico' },
  grass:    { 'zh-Hans': '草',     en: 'Grass',    ja: 'くさ',       es: 'Planta'    },
  ice:      { 'zh-Hans': '冰',     en: 'Ice',      ja: 'こおり',     es: 'Hielo'     },
  fighting: { 'zh-Hans': '格斗',   en: 'Fighting', ja: 'かくとう',   es: 'Lucha'     },
  poison:   { 'zh-Hans': '毒',     en: 'Poison',   ja: 'どく',       es: 'Veneno'    },
  ground:   { 'zh-Hans': '地面',   en: 'Ground',   ja: 'じめん',     es: 'Tierra'    },
  flying:   { 'zh-Hans': '飞行',   en: 'Flying',   ja: 'ひこう',     es: 'Volador'   },
  psychic:  { 'zh-Hans': '超能力', en: 'Psychic',  ja: 'エスパー',   es: 'Psíquico'  },
  bug:      { 'zh-Hans': '虫',     en: 'Bug',      ja: 'むし',       es: 'Bicho'     },
  rock:     { 'zh-Hans': '岩石',   en: 'Rock',     ja: 'いわ',       es: 'Roca'      },
  ghost:    { 'zh-Hans': '幽灵',   en: 'Ghost',    ja: 'ゴースト',   es: 'Fantasma'  },
  dragon:   { 'zh-Hans': '龙',     en: 'Dragon',   ja: 'ドラゴン',   es: 'Dragón'    },
  dark:     { 'zh-Hans': '恶',     en: 'Dark',     ja: 'あく',       es: 'Siniestro' },
  steel:    { 'zh-Hans': '钢',     en: 'Steel',    ja: 'はがね',     es: 'Acero'     },
  fairy:    { 'zh-Hans': '妖精',   en: 'Fairy',    ja: 'フェアリー', es: 'Hada'      },
};

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-stone-400', fire: 'bg-orange-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-300',
  fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-amber-600',
  flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-700', ghost: 'bg-purple-700', dragon: 'bg-violet-600',
  dark: 'bg-stone-700', steel: 'bg-slate-400', fairy: 'bg-pink-400',
};

const STAT_ABBR: Record<string, Record<string, string>> = {
  hp:               { zh: 'HP',  en: 'HP',  ja: 'HP',  es: 'PS'  },
  attack:           { zh: '攻击', en: 'Atk', ja: '攻撃', es: 'Ata' },
  defense:          { zh: '防御', en: 'Def', ja: '防御', es: 'Def' },
  'special-attack': { zh: '特攻', en: 'SpA', ja: '特攻', es: 'AtE' },
  'special-defense':{ zh: '特防', en: 'SpD', ja: '特防', es: 'DeE' },
  speed:            { zh: '速度', en: 'Spd', ja: '素早', es: 'Vel' },
};

interface Pokemon {
  id: number;
  name: string;
  names: Record<string, string>;
  types: string[];
  sprite: string;
  stats: { key: string; value: number }[];
}

function buildQuery(search: string, pokeLocale: string, selectedType: string, offset: number) {
  const isNumeric = /^\d+$/.test(search.trim());
  let where = `is_default: { _eq: true }`;

  if (search.trim()) {
    if (isNumeric) {
      where += `, id: { _eq: ${parseInt(search.trim())} }`;
    } else {
      where += `, pokemon_v2_pokemonspecy: {
        pokemon_v2_pokemonspeciesnames: {
          name: { _ilike: "%${search.trim().replace(/"/g, '')}%" },
          pokemon_v2_language: { name: { _eq: "${pokeLocale}" } }
        }
      }`;
    }
  }
  if (selectedType) {
    where += `, pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: "${selectedType}" } } }`;
  }

  return `{
    pokemon_v2_pokemon(
      where: { ${where} }
      order_by: { id: asc }
      limit: ${PAGE_SIZE}
      offset: ${offset}
    ) {
      id name
      pokemon_v2_pokemontypes { pokemon_v2_type { name } }
      pokemon_v2_pokemonsprites { sprites }
      pokemon_v2_pokemonstats { base_stat pokemon_v2_stat { name } }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesnames(
          where: { pokemon_v2_language: { name: { _in: ["zh-Hans","ja","en","es"] } } }
        ) { name pokemon_v2_language { name } }
      }
    }
    pokemon_v2_pokemon_aggregate(where: { ${where} }) {
      aggregate { count }
    }
  }`;
}

function PokemonCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-center bg-muted/50 p-4">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <div className="space-y-1 pt-1">
          {[1,2,3].map(i => <Skeleton key={i} className="h-2 w-full" />)}
        </div>
      </div>
    </div>
  );
}

function StatBar({ statKey, value, locale }: { statKey: string; value: number; locale: string }) {
  const label = STAT_ABBR[statKey]?.[locale] ?? statKey.slice(0,3).toUpperCase();
  const pct = Math.min((value / 255) * 100, 100);
  const color = value >= 100 ? 'bg-primary' : value >= 65 ? 'bg-primary/60' : 'bg-primary/35';
  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="w-6 shrink-0 text-right text-muted-foreground font-mono">{label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-5 shrink-0 text-right font-mono text-muted-foreground">{value}</span>
    </div>
  );
}

function PokemonCard({ pokemon, locale, pokeLocale }: { pokemon: Pokemon; locale: string; pokeLocale: string }) {
  const localeName = pokemon.names[pokeLocale] || pokemon.names['en'] || pokemon.name;
  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="relative flex items-center justify-center bg-muted/40 pt-4 pb-2">
        <span className="absolute left-2 top-1.5 font-mono text-[10px] text-muted-foreground/60">
          #{String(pokemon.id).padStart(4, '0')}
        </span>
        <img
          src={pokemon.sprite}
          alt={localeName}
          loading="lazy"
          className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
        />
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-sm font-semibold font-tech leading-tight">{localeName}</p>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map(type => (
            <span key={type} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${TYPE_COLORS[type] ?? 'bg-gray-400'}`}>
              {TYPE_I18N[type as PkType]?.[pokeLocale] ?? type}
            </span>
          ))}
        </div>
        <div className="space-y-0.5 pt-0.5">
          {pokemon.stats.map(s => (
            <StatBar key={s.key} statKey={s.key} value={s.value} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Pokedex() {
  const [pokemon, setPokemon]           = useState<Pokemon[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [inputValue, setInputValue]     = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [locale, setLocale]             = useState('zh');
  const [page, setPage]                 = useState(1);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const pokeLocale = LOCALE_MAP[locale] || 'en';

  // Sync with site locale
  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;
    if (stored) setLocale(stored);
    const h = (e: Event) => setLocale((e as CustomEvent).detail as string);
    window.addEventListener('locale-changed', h);
    return () => window.removeEventListener('locale-changed', h);
  }, []);

  // Debounce: auto-commit inputValue → activeSearch after 500ms
  useEffect(() => {
    setIsDebouncing(true);
    const t = setTimeout(() => {
      setActiveSearch(inputValue);
      setPage(1);
      setIsDebouncing(false);
    }, 500);
    return () => { clearTimeout(t); setIsDebouncing(false); };
  }, [inputValue]);

  const doFetch = useCallback(async (search: string, type: string, pl: string, pg: number) => {
    setLoading(true);
    setError('');
    try {
      const query = buildQuery(search, pl, type, (pg - 1) * PAGE_SIZE);
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0]?.message ?? 'GraphQL error');

      setTotal(json.data.pokemon_v2_pokemon_aggregate.aggregate.count);

      setPokemon(json.data.pokemon_v2_pokemon.map((p: any) => {
        const rawSprites = p.pokemon_v2_pokemonsprites[0]?.sprites;
        const sprites = typeof rawSprites === 'string' ? JSON.parse(rawSprites) : rawSprites ?? {};
        const sprite =
          sprites?.other?.['official-artwork']?.front_default ||
          sprites?.front_default ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        const names: Record<string, string> = {};
        p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames?.forEach((n: any) => {
          names[n.pokemon_v2_language.name] = n.name;
        });
        return {
          id: p.id, name: p.name, names,
          types: p.pokemon_v2_pokemontypes.map((t: any) => t.pokemon_v2_type.name),
          sprite,
          stats: p.pokemon_v2_pokemonstats.map((s: any) => ({ key: s.pokemon_v2_stat.name, value: s.base_stat })),
        };
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: first 24, and when filters change
  useEffect(() => {
    doFetch(activeSearch, selectedType, pokeLocale, page);
  }, [activeSearch, selectedType, pokeLocale, page, doFetch]);

  // Immediate search (button / Enter)
  const handleSearch = () => {
    setIsDebouncing(false);
    setActiveSearch(inputValue);
    setPage(1);
  };

  const handleClear = () => {
    setInputValue('');
    setActiveSearch('');
    setPage(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const UI: Record<string, Record<string, string>> = {
    placeholder: { zh: '输入名称或编号',          en: 'Name or #',            ja: '名前または番号',       es: 'Nombre o #'           },
    searchBtn:   { zh: '查询',                    en: 'Search',               ja: '検索',                es: 'Buscar'               },
    clearBtn:    { zh: '清除',                    en: 'Clear',                ja: 'クリア',              es: 'Limpiar'              },
    all:         { zh: '全部属性',                en: 'All Types',            ja: 'すべて',              es: 'Todos'                },
    noResult:    { zh: '没有找到匹配的宝可梦',     en: 'No Pokémon found',     ja: '見つかりません',       es: 'No encontrado'        },
    total:       { zh: `共 ${total} 只`,          en: `${total} total`,       ja: `計 ${total} 匹`,      es: `${total} en total`    },
    prev:        { zh: '上一页',                  en: 'Prev',                 ja: '前へ',                es: 'Ant'                  },
    next:        { zh: '下一页',                  en: 'Next',                 ja: '次へ',                es: 'Sig'                  },
    retry:       { zh: '重试',                    en: 'Retry',                ja: '再試行',              es: 'Reintentar'           },
  };
  const u = (key: string) => UI[key]?.[locale] ?? UI[key]?.en ?? key;

  return (
    <div ref={topRef} className="not-prose space-y-5 scroll-mt-4">
      {/* Header */}
      <div className="text-center">
        <SplitText
          text="Pokédex"
          tag="h2"
          className="text-4xl font-bold font-tech"
          splitType="chars"
          delay={60}
          duration={0.6}
          from={{ opacity: 0, y: 30, rotateX: -40 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
          threshold={0.2}
          rootMargin="-50px"
        />
        {!loading && (
          <p className="mt-1 text-xs text-muted-foreground font-tech">{u('total')}</p>
        )}
      </div>

      {/* Language + Search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Locale picker */}
        <div className="flex gap-1 shrink-0">
          {Object.entries(LOCALE_LABELS).map(([l, label]) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setPage(1); }}
              className={`px-2.5 py-1 rounded-md text-xs font-tech border transition-colors ${
                locale === l
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search input + buttons */}
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Input
              placeholder={u('placeholder')}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="font-tech pr-7"
            />
            {isDebouncing && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="block h-1 w-1 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-tech hover:bg-primary/90 transition-colors shrink-0"
          >
            {u('searchBtn')}
          </button>
          {(inputValue || activeSearch) && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-lg border border-border text-xs font-tech text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors shrink-0"
            >
              {u('clearBtn')}
            </button>
          )}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => { setSelectedType(''); setPage(1); }}
          className={`px-2.5 py-0.5 rounded-full text-xs font-tech border transition-colors ${
            selectedType === ''
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:border-foreground/40'
          }`}
        >
          {u('all')}
        </button>
        {ALL_TYPES.map(type => (
          <button
            key={type}
            onClick={() => { setSelectedType(selectedType === type ? '' : type); setPage(1); }}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-white capitalize transition-opacity ${TYPE_COLORS[type]} ${
              selectedType && selectedType !== type ? 'opacity-40' : 'opacity-100'
            }`}
          >
            {TYPE_I18N[type]?.[pokeLocale] ?? type}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-center text-sm text-destructive font-tech">
          {error}
          <button onClick={() => doFetch(activeSearch, selectedType, pokeLocale, page)} className="ml-2 underline">
            {u('retry')}
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => <PokemonCardSkeleton key={i} />)
          : pokemon.map((p, i) => (
              <AnimatedContent key={p.id} distance={40} direction="vertical" delay={Math.min(i * 0.025, 0.4)} duration={0.35} threshold={0.05}>
                <PokemonCard pokemon={p} locale={locale} pokeLocale={pokeLocale} />
              </AnimatedContent>
            ))
        }
      </div>

      {!loading && pokemon.length === 0 && !error && (
        <p className="text-center text-sm text-muted-foreground font-tech py-8">{u('noResult')}</p>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-tech text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {u('prev')}
          </button>
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`e${i}`} className="px-2 py-1 text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className={`min-w-[2rem] px-2 py-1 rounded-md text-xs font-tech border transition-colors ${
                      page === p
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-tech text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {u('next')}
          </button>
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong>数据：</strong>
          <a href="https://pokeapi.co/docs/graphql" className="underline ml-1" target="_blank" rel="noopener noreferrer">PokeAPI GraphQL</a>
          {' '}· 服务端过滤 · 中/英/日/西 多语言 · Enter 或点击查询
        </div>
      )}
    </div>
  );
}
