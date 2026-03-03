'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/src/lib/api'
import { Trash2 } from 'lucide-react' // Opcional: npm install lucide-react
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import  { toast } from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Transaction {
  id: number
  description: string
  amount: number
  category: string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState({ incomes: 0, expenses: 0, total: 0 })

  const [selectedMonth, setSelectedMonth] = useState(new Date(). getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  async function loadData() {
    try {
      const tRes = await api.get(`/transactions?month=${selectedMonth}&year=${selectedYear}`)
      const sRes = await api.get(`/transactions/summary?month=${selectedMonth}&year=${selectedYear}`)

      setTransactions(tRes.data)
      setSummary(sRes.data)
    } catch (error) {
      console.error("Erro ao carregar", error)
    }
  }
  
  async function handleCreateTransaction(e: React.FormEvent) {
    e.preventDefault()

    const loadingToast = toast.loading('Salvando transação...')

    try {
      await api.post('/transactions', {
        description,
        amount: Number(amount),
        category
      })

      toast.success('Transação adicionada com sucesso!', { id: loadingToast })

      setDescription(''); setAmount(''); setCategory('')
      loadData()
    } catch (error) {
      toast.error('Erro ao cadastrar. Verifique os dados.', { id: loadingToast })
    }
  }

  async function handleDelete(id: number) {
    try {
        await api.delete(`/transactions/${id}`)
        toast.success('Transação removida!')
        loadData()
      } catch (error) {
        toast.error("Não foi possível excluir.")
      }
    
  }

  useEffect(() => { 
     const lastVisit = localStorage.getItem('last_visit')
     const today = new Date().toLocaleDateString()
     
     if (lastVisit !== today) {
      toast(`Bem-vindo de volta! Hoje é dia ${today}`, {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      localStorage.setItem('last_visit', today)
    }

     loadData()
  }, [selectedMonth, selectedYear])

  // Configuração do Gráfico de Pizza
  const chartData = useMemo(() => {
    return {
      labels: ['Entradas', 'Saídas'],
      datasets: [
        {
          label: 'R$',
          data: [summary.incomes, summary.expenses],
          backgroundColor: ['#22c55e', '#ef4444'],
          hoverOffset: 10,
          borderWidth: 0,
        },
      ],
    };
  }, [summary]);

  return (
    <main className="max-w-6xl mx-auto p-10 font-sans text-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Controle de Gastos 💰</h1>
      </div>

      <div className='flex gap-4 mb-8 bg-gray-800 p-4 rounded-xl border border-gray-700 w-fit'>
        <div className='flex flex-col'>
          <label className='text-xs text-gray-500 uppercase font-bold mb-1'>Mês</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className='bg-gray-900 text-white p-2 rounded border border-gray-700 outline-none focus:border-blue-500 transition-all'
          >
            <option value={1}>Janeiro</option>
            <option value={2}>Fevereiro</option>
            <option value={3}>Março</option>
            <option value={4}>Abril</option>
            <option value={5}>Maio</option>
            <option value={6}>Junho</option>
            <option value={7}>Julho</option>
            <option value={8}>Agosto</option>
            <option value={9}>Setembro</option>
            <option value={10}>Outubro</option>
            <option value={11}>Novembro</option>
            <option value={12}>Dezembro</option>
          </select>
        </div>

        <div className='flex flex-col'>
          <label className='text-xs text-gray-500 uppercase font-bold mb-1'>Ano</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className='bg-gray-900 text-white p-2 rounded border border-gray-700 outline-none focus:border-blue-500 transition-all'
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Coluna da Esquerda: Cards e Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-900/30 p-6 rounded-xl border border-green-500/30">
              <p className="text-green-400 text-xs uppercase font-bold">Entradas</p>
              <h2 className="text-2xl font-bold">R$ {summary.incomes.toFixed(2)}</h2>
            </div>
            <div className="bg-red-900/30 p-6 rounded-xl border border-red-500/30">
              <p className="text-red-400 text-xs uppercase font-bold">Saídas</p>
              <h2 className="text-2xl font-bold">R$ {summary.expenses.toFixed(2)}</h2>
            </div>
            <div className={`${summary.total >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'} p-6 rounded-xl border border-yellow-500/30`}>
              <p className="text-yellow-300 text-xs uppercase font-bold">Saldo</p>
              <h2 className="text-2xl font-bold text-yellow-300">R$ {summary.total.toFixed(2)}</h2>
            </div>
          </div>

          <form onSubmit={handleCreateTransaction} className="bg-gray-800 p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-gray-700">
            <div className="md:col-span-1">
              <label className="text-xs text-gray-400 block mb-1">Descrição</label>
              <input className="w-full bg-gray-900 border-gray-700 rounded p-2" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Valor</label>
              <input type="number" className="w-full bg-gray-900 border-gray-700 rounded p-2" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Categoria</label>
              <input className="w-full bg-gray-900 border-gray-700 rounded p-2" value={category} onChange={e => setCategory(e.target.value)} required />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition-all">Adicionar</button>
          </form>
        </div>

        {/* Coluna da Direita: Gráfico */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Proporção de Gastos</h3>
          <div className="w-64 h-64">
            <Pie data={chartData} options={{
              plugins: { 
                legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 12 } } } 
                },
                maintainAspectRatio: true,
                }} />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className='p-4 bg-gray-900/50 border-b border-gray-700'>
           <h3 className='font-bold text-gray-300 uppercase text-sm tracking-widest'>Histórico de Transações</h3>
        </div>
        <table className="w-full text-left text-sm">
        <thead className="bg-gray-900/80 text-gray-500">
            <tr>
              <th className="p-4 font-semibold uppercase italic">Descrição</th>
              <th className="p-4 font-semibold uppercase italic">Valor</th>
              <th className="p-4 font-semibold uppercase italic">Categoria</th>
              <th className="p-4 text-center font-semibold uppercase italic">Ações</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-700/50 transition-colors group">
                <td className="p-4 text-gray-200">{t.description}</td>
                <td className={`p-4 font-bold font-mono ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                   {t.amount > 0 ? '+' : ''} R$ {t.amount.toFixed(2)}
                </td>
                <td className="p-4">
                  <span className='bg-gray-900 text-gray-400 text-gray-400 px-3 py-1 rounded-full text-xs border border-gray-700'>
                  {t.category}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(t.id)}
                  className="text-gray-500 hover:text-red-500 transition-all p-2 hover:bg-red-500/10 rounded-lg"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className='p-10 text-center text-gray-500 italic'>Nenhuma transação encontrada. Comece adicionando uma acima!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}