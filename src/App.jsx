// Jogo da Velha - 1 jogador (X) contra o computador (O). Toda a lógica no front.
// Rodar localmente: npm run dev e acessar localhost:5173
import { useState, useEffect } from 'react'
import './App.css'

const JOGADOR = 'X'
const COMPUTADOR = 'O'

// As 8 combinações que vencem o jogo
const LINHAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6],            // diagonais
]

// Retorna 'X', 'O' ou null
function calcularVencedor(tab) {
  for (const [a, b, c] of LINHAS) {
    if (tab[a] && tab[a] === tab[b] && tab[a] === tab[c]) {
      return tab[a]
    }
  }
  return null
}

// Procura uma jogada que complete uma linha para o símbolo dado
function jogadaVencedora(tab, simbolo) {
  for (const [a, b, c] of LINHAS) {
    const linha = [tab[a], tab[b], tab[c]]
    const vazias = [a, b, c].filter((i) => !tab[i])
    if (vazias.length === 1 && linha.filter((v) => v === simbolo).length === 2) {
      return vazias[0]
    }
  }
  return null
}

// Heurística simples do computador: vencer > bloquear > centro > aleatório
function escolherJogadaComputador(tab) {
  const vencer = jogadaVencedora(tab, COMPUTADOR)
  if (vencer !== null) return vencer

  const bloquear = jogadaVencedora(tab, JOGADOR)
  if (bloquear !== null) return bloquear

  if (!tab[4]) return 4

  const livres = tab.map((v, i) => (v ? null : i)).filter((i) => i !== null)
  return livres[Math.floor(Math.random() * livres.length)]
}

function App() {
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null))
  const [vezDoJogador, setVezDoJogador] = useState(true)
  const [placar, setPlacar] = useState({ vitorias: 0, derrotas: 0, empates: 0 })

  const vencedor = calcularVencedor(tabuleiro)
  const empate = !vencedor && tabuleiro.every((c) => c !== null)
  const fimDeJogo = vencedor || empate

  // Computador joga quando for a vez dele e o jogo não tiver acabado
  useEffect(() => {
    if (vezDoJogador || fimDeJogo) return

    const id = setTimeout(() => {
      setTabuleiro((tab) => {
        // revalida dentro do setState para evitar jogada inválida
        if (calcularVencedor(tab) || tab.every((c) => c !== null)) return tab
        const i = escolherJogadaComputador(tab)
        const novo = [...tab]
        novo[i] = COMPUTADOR
        return novo
      })
      setVezDoJogador(true)
    }, 400)

    return () => clearTimeout(id)
  }, [vezDoJogador, fimDeJogo])

  // Contabiliza o resultado no placar quando o jogo termina
  useEffect(() => {
    if (vencedor === JOGADOR) {
      setPlacar((p) => ({ ...p, vitorias: p.vitorias + 1 }))
    } else if (vencedor === COMPUTADOR) {
      setPlacar((p) => ({ ...p, derrotas: p.derrotas + 1 }))
    } else if (empate) {
      setPlacar((p) => ({ ...p, empates: p.empates + 1 }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vencedor, empate])

  function jogar(i) {
    if (!vezDoJogador || fimDeJogo || tabuleiro[i]) return
    const novo = [...tabuleiro]
    novo[i] = JOGADOR
    setTabuleiro(novo)
    setVezDoJogador(false)
  }

  function novoJogo() {
    setTabuleiro(Array(9).fill(null))
    setVezDoJogador(true)
  }

  function zerarPlacar() {
    setPlacar({ vitorias: 0, derrotas: 0, empates: 0 })
    novoJogo()
  }

  let status
  if (vencedor === JOGADOR) status = 'Você venceu! 🎉'
  else if (vencedor === COMPUTADOR) status = 'O computador venceu! 🤖'
  else if (empate) status = 'Deu velha! 🤝'
  else if (vezDoJogador) status = 'Sua vez (X)'
  else status = 'Computador pensando...'

  return (
    <div className="app">
      <h1>Jogo da Velha</h1>
      <p className="subtitulo">Você (X) contra o computador (O)</p>

      <p className="status">{status}</p>

      <div className="tabuleiro">
        {tabuleiro.map((valor, i) => (
          <button
            key={i}
            className={`celula ${valor ? valor.toLowerCase() : ''}`}
            onClick={() => jogar(i)}
            disabled={!!valor || fimDeJogo || !vezDoJogador}
          >
            {valor}
          </button>
        ))}
      </div>

      <div className="painel">
        <button onClick={novoJogo}>Novo jogo</button>
        <button onClick={zerarPlacar}>Zerar placar</button>
      </div>

      <div className="placar">
        <span>Vitórias: {placar.vitorias}</span>
        <span>Derrotas: {placar.derrotas}</span>
        <span>Empates: {placar.empates}</span>
      </div>
    </div>
  )
}

export default App
