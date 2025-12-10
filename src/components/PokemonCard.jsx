export default function PokemonCard({ pkm, caught, onToggle }) {
  const mainType = pkm.type[0].toLowerCase();

  return (
    <div className={`
      relative overflow-hidden rounded-xl p-2 transition-all duration-300 pokemon-card
      w-24 h-32  // TAMANHO REDUZIDO
      ${caught 
        ? 'bg-gradient-to-br from-gray-900 to-green-900/30 border border-green-600 shadow-md' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-sm'
      }
      hover:shadow-lg hover:scale-105 hover:border-gray-600 cursor-pointer
    `}>
      
      {/* Indicador de capturado - MENOR */}
      {caught && (
        <div className="absolute top-1 right-1 z-10">
          <div className="bg-green-600 text-white p-0.5 rounded-full shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Container da imagem - MUITO MENOR */}
      <div className="relative mb-1">
        <div className={`
          w-16 h-16 mx-auto rounded-full p-1 shadow-inner  // REDUZIDO
          ${caught 
            ? 'bg-gradient-to-br from-green-900/50 to-emerald-800/50' 
            : 'bg-gradient-to-br from-gray-800 to-gray-700'
          }
        `}>
          <div className="w-full h-full bg-gray-900/80 rounded-full flex items-center justify-center">
            {pkm.sprite ? (
              <img 
                src={pkm.sprite} 
                alt={pkm.name} 
                className="w-12 h-12 object-contain drop-shadow-sm"  // IMAGEM MENOR
              />
            ) : (
              <span className="text-gray-500 font-bold text-xs">#{pkm.id.toString().padStart(3, '0')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Número e nome - TEXTO MENOR */}
      <div className="text-center mb-1 relative z-10">
        <div className="text-[10px] font-mono text-gray-400 bg-gray-800/50 rounded-full px-1 py-0.5 inline-block mb-0.5">
          #{pkm.id.toString().padStart(3, '0')}
        </div>
        <div className="text-xs font-bold capitalize text-white bg-gray-800/50 rounded px-1 py-0.5 truncate">
          {pkm.name}
        </div>
      </div>

      {/* Tipos - MENORES E SIMPLIFICADOS */}
      <div className="flex gap-0.5 justify-center mb-1 relative z-10">
        {pkm.type.slice(0, 1).map(type => (  // MOSTRA APENAS 1 TIPO
          <span 
            key={type}
            className={`
              px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm 
              type-${type.toLowerCase()} border border-white/10 truncate
            `}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Botão de captura - MUITO MENOR */}
      <button
        onClick={onToggle}
        className={`
          w-full py-1 rounded-lg text-[10px] font-bold transition-all duration-200 relative z-10 
          shadow-sm border border-white/10
          ${caught 
            ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white' 
            : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white'
          }
          hover:scale-105 active:scale-95
        `}
      >
        {caught ? '✓ Capturado' : '+ Capturar'}
      </button>
    </div>
  )
}