"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Player } from "@/types/Player";
import { PlayerStatistic } from "@/types/PlayerStatistic";
import {
  Star,
  Clock,
  Goal,
  Shield,
  AlertCircle,
  ArrowUpRight,
  Target,
  HandMetal,
  Flag,
  BadgeX,
  BadgeCheck,
  Ban,
  Frown,
  CornerDownRight,
  SquareStack,
  Undo2,
  MoveUpRight,
  ActivitySquare,
  Dribbble,
} from "lucide-react";

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-1 last:border-none text-sm">
      <span className="flex items-center gap-2 text-gray-700 font-medium">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [player, setPlayer] = useState<Player | null>(null);
  const [statistics, setStatistics] = useState<PlayerStatistic[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`http://127.0.0.1:8000/api/player/${id}`),
      fetch(`http://127.0.0.1:8000/api/player-statistic/${id}`),
    ])
      .then(async ([playerRes, statsRes]) => {
        if (!playerRes.ok)
          throw new Error(`Erro ao buscar jogador: ${playerRes.status}`);
        if (!statsRes.ok)
          throw new Error(`Erro ao buscar estatísticas: ${statsRes.status}`);

        const playerData = await playerRes.json();
        const statsData = await statsRes.json();

        setPlayer(playerData);
        setStatistics(statsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Carregando...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">Erro: {error}</p>;
  if (!player)
    return (
      <p className="text-center mt-10 text-gray-500">Jogador não encontrado.</p>
    );

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        {player.name}
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg w-48 h-48 mx-auto md:mx-0">
          <Image
            src={player.photo_url}
            alt={`Foto de ${player.name}`}
            width={192}
            height={192}
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Time Atual
          </h2>
          <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4 shadow-inner">
            <Image
              src={player.actual_team.photo_url}
              alt={`Logo do ${player.actual_team.name}`}
              width={64}
              height={64}
              className="object-contain"
            />
            <span className="text-xl font-semibold text-gray-900">
              {player.actual_team.name}
            </span>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center md:text-left">
          Times Anteriores
        </h2>
        {player.last_teams.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {player.last_teams.map((team) => (
              <div
                key={team.id}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                title={team.name}
              >
                <Image
                  src={team.photo_url}
                  alt={`Logo do ${team.name}`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <span className="text-gray-800 font-medium text-center">
                  {team.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Sem times anteriores registrados.
          </p>
        )}
      </section>

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
                value={`${statistic.min_played} min`}
                icon={<Clock className="text-blue-600" />}
              />
              <Stat
                label="Rating"
                value={`${statistic.rating}/10`}
                icon={<Star className="text-yellow-500" />}
              />
              <Stat
                label="Impedimentos"
                value={statistic.offsides}
                icon={<AlertCircle className="text-orange-600" />}
              />
              <Stat
                label="Chutes"
                value={statistic.shots}
                icon={<Target className="text-red-600" />}
              />
              <Stat
                label="Chutes a Gol"
                value={statistic.shots_on_goal}
                icon={<ArrowUpRight className="text-red-400" />}
              />
              <Stat
                label="Gols"
                value={statistic.goals}
                icon={<Goal className="text-green-600" />}
              />
              <Stat
                label="Gols Concedidos"
                value={statistic.goals_conceded}
                icon={<Frown className="text-rose-600" />}
              />
              <Stat
                label="Assistências"
                value={statistic.assists}
                icon={<ArrowUpRight className="text-emerald-500" />}
              />
              <Stat
                label="Defesas"
                value={statistic.saves}
                icon={<Shield className="text-sky-700" />}
              />
              <Stat
                label="Passes"
                value={statistic.passes}
                icon={<Dribbble className="text-indigo-500" />}
              />
              <Stat
                label="Precisão de Passes"
                value={`${statistic.accuracy}%`}
                icon={<ActivitySquare className="text-blue-500" />}
              />
              <Stat
                label="Duelos"
                value={statistic.duels}
                icon={<MoveUpRight className="text-gray-600" />}
              />
              <Stat
                label="Duelos Ganhos"
                value={statistic.duels_won}
                icon={<BadgeCheck className="text-green-500" />}
              />
              <Stat
                label="Desarmes"
                value={statistic.tackles}
                icon={<Shield className="text-gray-800" />}
              />
              <Stat
                label="Bloqueios"
                value={statistic.blocks}
                icon={<SquareStack className="text-purple-600" />}
              />
              <Stat
                label="Interceptações"
                value={statistic.interceptions}
                icon={<CornerDownRight className="text-teal-500" />}
              />
              <Stat
                label="Dribles Tentados"
                value={statistic.dribbles_attempts}
                icon={<Dribbble className="text-fuchsia-600" />}
              />
              <Stat
                label="Dribles Completos"
                value={statistic.dribbles_success}
                icon={<Dribbble className="text-green-600" />}
              />
              <Stat
                label="Dribles Sofridos"
                value={statistic.dribbles_past}
                icon={<Dribbble className="text-rose-400" />}
              />
              <Stat
                label="Faltas Recebidas"
                value={statistic.fouls_drown}
                icon={<Flag className="text-green-600" />}
              />
              <Stat
                label="Faltas Cometidas"
                value={statistic.fouls_committed}
                icon={<Flag className="text-red-600" />}
              />
              <Stat
                label="Cartões Amarelos"
                value={statistic.yellow_card}
                icon={<AlertCircle className="text-yellow-400" />}
              />
              <Stat
                label="Cartões Vermelhos"
                value={statistic.red_card}
                icon={<Ban className="text-red-700" />}
              />
              <Stat
                label="Pênaltis Sofridos"
                value={statistic.penalty_won}
                icon={<HandMetal className="text-green-600" />}
              />
              <Stat
                label="Pênaltis Cometidos"
                value={statistic.penalty_committed}
                icon={<HandMetal className="text-red-600" />}
              />
              <Stat
                label="Pênaltis Convertidos"
                value={statistic.penalty_scored}
                icon={<Goal className="text-green-700" />}
              />
              <Stat
                label="Pênaltis Perdidos"
                value={statistic.penalty_missed}
                icon={<BadgeX className="text-gray-500" />}
              />
              <Stat
                label="Pênaltis Defendidos"
                value={statistic.penalty_saved}
                icon={<Undo2 className="text-blue-700" />}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
