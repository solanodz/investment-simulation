import { InvestmentCalculator } from "@/components/InvestmentCalculator"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}

      <main className="container mx-auto px-4 flex-grow">
        <div className="flex flex-row gap-6 lg:gap-10 m-10">
          {/* Columna Izquierda - 3/4 */}
          <div className="w-2/5 space-y-6">
            <div className="prose dark:prose-invert">
              <h1 className="text-2xl font-bold">Crypto Investment Simulator</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Look how much you could have earned by investing in cryptocurrencies in the past.
                Select a cryptocurrency, enter your investment amount and the date to see the performance.
              </p>
            </div>

            <InvestmentCalculator />
          </div>

          {/* Columna Derecha - Resultados - 1/4 */}
          <div className="w-3/5 lg:sticky lg:top-6 h-fit">
            <div id="results-container" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
