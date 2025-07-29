export default function Home() {
  return (
    <>
      <h1 className="mb-4">Bem-vindo ao BetStats</h1>
      <p className="lead">
        Acompanhe o desempenho de jogadores, times e receba análises
        estatísticas para melhorar suas apostas esportivas.
      </p>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Tendências de Partidas</h5>
              <p className="card-text">
                Saiba quais jogos têm maior chance de over, BTTS ou escanteios
                com base em dados reais.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Desempenho de Jogadores</h5>
              <p className="card-text">
                Veja quem está se destacando nas últimas rodadas com dados como
                gols, assistências e finalizações.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Estatísticas de Times</h5>
              <p className="card-text">
                Análise completa de rendimento dos clubes em casa, fora, em
                escanteios, gols e disciplina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
