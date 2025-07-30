"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Team } from "@/types/Team";
import { TeamStatistics } from "@/types/TeamStatistics";
import Stat from "@/app/functions/stat";
import { Clock } from "lucide-react";

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [team, setTeam] = useState<Team | null>(null);
  const [statistics, setStatistics] = useState<TeamStatistics[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`http://127.0.0.1:8000/api/team/${id}`),
      fetch(`http://127.0.0.1:8000/api/team-statistic/${id}`),
    ])
      .then(async ([teamRes, statsRes]) => {
        if (!teamRes.ok)
          throw new Error(`Erro ao buscar jogador: ${teamRes.status}`);
        if (!statsRes.ok)
          throw new Error(`Erro ao buscar estatísticas: ${statsRes.status}`);

        const teamData = await teamRes.json();
        const statsData = await statsRes.json();

        setTeam(teamData);
        setStatistics(statsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Carregando...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">Erro: {error}</p>;
  if (!team)
    return (
      <p className="text-center mt-10 text-gray-500">Jogador não encontrado.</p>
    );

    console.log("Team statis", statistics);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        {team.name}
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg w-48 h-48 mx-auto md:mx-0">
          <Image
            src={team.photo_url}
            alt={`Foto de ${team.name}`}
            width={192}
            height={192}
            className="object-cover"
            priority
          />
        </div>

        {statistics &&
        statistics.map((statistic) => (
          <div
            key={statistic.id}
            className="bg-white p-5 rounded-xl shadow border border-gray-200 space-y-3"
          >
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-3">
              Estatísticas da Partida {statistic.game.home_team.name} X {statistic.game.away_team.name} 
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <Stat
                label="Tempo de Jogo"
                value={`${statistic.ball_possession} min`}
                icon={<Clock className="text-blue-600" />}
              />
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}
