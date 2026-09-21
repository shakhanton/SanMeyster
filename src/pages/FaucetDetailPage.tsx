import { useParams } from 'react-router-dom'

function FaucetDetailPage() {
  const { brand, model } = useParams()

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      <h1 className="mb-2 text-xl font-semibold text-slate-900">
        {brand} / {model}
      </h1>
      <p>Сторінка моделі з'явиться після наповнення каталогу.</p>
    </div>
  )
}

export default FaucetDetailPage
