import { useEffect, useState } from 'react'
import Header from './components/Header'
import PokemonCard from './components/PokemonCard'
import Filters from './components/Filters'
import pokedexZA from './data/legends_za.json'

export default function App() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)
  const [caught, setCaught] = useState(() => {
    try {
      const saved = localStorage.getItem('pokedex-za-caught')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [data, setData] = useState(pokedexZA)

  useEffect(() => {
    localStorage.setItem('pokedex-za-caught', JSON.stringify(caught))
  }, [caught])

  const toggleCaught = (id) => {
    setCaught(prev => ({ 
      ...prev, 
      [id]: !prev[id] 
    }))
  }

  const toggleShowOnlyMissing = () => {
    setShowOnlyMissing(prev => !prev)
  }

  // Filtros aplicados em sequência - ESTE TEM QUE VIR PRIMEIRO
  const filtered = data
    .filter(p => (typeFilter === 'All' ? true : p.type.includes(typeFilter)))
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => !showOnlyMissing || !caught[p.id])

  // AGORA SIM podemos usar a variável filtered
  // Função para agrupar Pokémon em grupos de 30
  const groupedPokemon = filtered.reduce((groups, pokemon, index) => {
    // Calcula em qual grupo este Pokémon vai (0, 1, 2, etc.)
    const groupIndex = Math.floor(index / 30)
    
    // Se o grupo ainda não existe, cria um array vazio
    if (!groups[groupIndex]) {
      groups[groupIndex] = []
    }
    
    // Adiciona o Pokémon ao grupo
    groups[groupIndex].push(pokemon)
    
    return groups
  }, [])

  const total = data.length
  const captured = data.filter(pkm => caught[pkm.id]).length
  const missing = total - captured

  return (
    <div className="min-h-screen pokemon-bg-colorful p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header total={total} captured={captured} />

       { /* Informações da Dex */}
        <div className="mt-6 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Legends: Z-A
            </div>
            <div className="text-lg font-bold text-white">Pokédex Regional</div>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-700/30">
              <div className="text-blue-300 font-semibold">Total</div>
              <div className="text-blue-100 font-bold">{total} Pokémon</div>
            </span>
            <span className="bg-green-900/30 px-3 py-2 rounded-lg border border-green-700/30">
              <div className="text-green-300 font-semibold">Capturados</div>
              <div className="text-green-100 font-bold">{captured}</div>
            </span>
            <span className="bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <div className="text-purple-300 font-semibold">Por Capturar</div>
              <div className="text-purple-100 font-bold">{missing}</div>
            </span>
            <span className="bg-orange-900/30 px-3 py-2 rounded-lg border border-orange-700/30">
              <div className="text-orange-300 font-semibold">Progresso</div>
              <div className="text-orange-100 font-bold">{Math.round((captured / total) * 100)}%</div>
            </span>
            {/* Mostrar estado do filtro ativo */}
            {showOnlyMissing && (
              <span className="bg-red-900/30 px-3 py-2 rounded-lg border border-red-700/30">
                <div className="text-red-300 font-semibold">Filtro Ativo</div>
                <div className="text-red-100 font-bold">Apenas Faltam</div>
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Filters
            query={query}
            onQuery={setQuery}
            typeFilter={typeFilter}
            onType={setTypeFilter}
            showOnlyMissing={showOnlyMissing}
            onShowOnlyMissing={toggleShowOnlyMissing}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/80 rounded-xl shadow-lg border border-gray-700/50 mt-6">
            <div className="text-gray-400 text-6xl mb-4">
              {showOnlyMissing && captured === total ? '🎉' : '🔍'}
            </div>
            <div className="text-gray-200 font-bold text-lg">
              {showOnlyMissing && captured === total 
                ? 'Parabéns! Capturaste todos!' 
                : 'Nenhum Pokémon encontrado'
              }
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {showOnlyMissing && captured === total 
                ? 'Completaste a Pokédex!' 
                : 'Tenta alterar os filtros ou a pesquisa'
              }
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {/* Mapeia cada grupo de Pokémon */}
            {groupedPokemon.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-8">
                
                {/* CABEÇALHO DO GRUPO */}
                <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg mb-4 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white">
                    Grupo {groupIndex + 1} 
                    <span className="text-gray-400 text-sm font-normal ml-2">
                      (Pokémon {groupIndex * 30 + 1} - {groupIndex * 30 + group.length})
                    </span>
                  </h3>
                </div>
                
                {/* GRID DE POKÉMON DENTRO DO GRUPO - 6 COLUNAS MÁXIMO */}
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2">  {group.map(pkm => (
                    <PokemonCard
                      key={pkm.id}
                      pkm={pkm}
                      caught={!!caught[pkm.id]}
                      onToggle={() => toggleCaught(pkm.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contador de resultados */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          {showOnlyMissing && (
            <span className="bg-red-900/30 px-3 py-1 rounded-lg">
              A mostrar {filtered.length} Pokémon por capturar
            </span>
          )}
        </div>
      </div>
    </div>
  );
}