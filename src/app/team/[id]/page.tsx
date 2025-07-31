"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Team } from "@/types/Team";
import { TeamStatistics } from "@/types/TeamStatistics";
import Link from "next/link";
import Image from "next/image";
import TeamCard from "@/app/components/TeamCard";
import StatProgression from "@/app/functions/statProgression";
import { GiGoalKeeper, GiSoccerKick } from "react-icons/gi";
import { Ban, Inbox, Box, AlertTriangle, Flag, FlagOff, TrendingUp, RectangleVertical} from "lucide-react";

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [team, setTeam] = useState<Team | null>(null);
  const [statistics, setStatistics] = useState<TeamStatistics[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shotsCardProgression = statistics?.map((s) => s.shots) || [];
  const shotsOnCardProgression = statistics?.map((s) => s.shots_on) || [];
  const shotsOffCardProgression = statistics?.map((s) => s.shots_off) || [];
  const blockedShotsCardProgression = statistics?.map((s) => s.blocked_shots) || [];
  const shotsInsideCardProgression = statistics?.map((s) => s.shots_inside_box) || [];
  const shotsOutsideCardProgression = statistics?.map((s) => s.shots_outside_box) || [];
  const foulsCardProgression = statistics?.map((s) => s.fouls) || [];
  const cornersCardProgression = statistics?.map((s) => s.corners) || [];
  const offsidesCardProgression = statistics?.map((s) => s.offsides) || [];
  const ballPossessionCardProgression = statistics?.map((s) => s.ball_possession) || [];
  const passesCardProgression = statistics?.map((s) => s.total_passes) || [];
  const accuracyCardProgression = statistics?.map((s) => s.passes_porcentage) || [];
  const yellowCardProgression = statistics?.map((s) => s.yellow_cards) || [];
  const redCardProgression = statistics?.map((s) => s.red_cards) || [];
  const savesCardProgression = statistics?.map((s) => s.goalkeeper_saves) || [];

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
      <TeamCard team={team} />

      <h2 className="mt-4 h4 mb-3 text-center">Últimas Partidas do Time</h2>
      {statistics && (
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {statistics.map((statistic) => (
            <div
              key={statistic.id}
              className="bg-light rounded border shadow-sm px-4 py-3 d-flex align-items-center justify-content-center"
              style={{
                minWidth: 200,
                maxWidth: 200,
                flexDirection: "row",
                gap: "0.75rem",
              }}
            >
              <Link
                href={`/team/${statistic.game.home_team.id}`}
                className="text-decoration-none text-center d-flex flex-column align-items-center"
              >
                <Image
                  src={statistic.game.home_team.photo_url}
                  alt={statistic.game.home_team.name}
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
                <small className="text-muted">
                  {statistic.game.home_team.name}
                </small>
              </Link>

              <div className="fw-bold fs-5 text-secondary">X</div>

              <Link
                href={`/team/${statistic.game.away_team.id}`}
                className="text-decoration-none text-center d-flex flex-column align-items-center"
              >
                <Image
                  src={statistic.game.away_team.photo_url}
                  alt={statistic.game.away_team.name}
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
                <small className="text-muted">
                  {statistic.game.away_team.name}
                </small>
              </Link>
            </div>
          ))}
        </div>
      )}

      <h2 className="h4 mb-3 text-center mt-3">
        Progressão das Estatísticas do Jogador
      </h2>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        <StatProgression
          title="Cartões Amarelos"
          data={yellowCardProgression}
          icon={<RectangleVertical fill="yellow" color="yellow" />}
        />

        <StatProgression
          title="Cartões Vermelhos"
          data={redCardProgression}
          icon={<RectangleVertical fill="red" color="red" />}
        />

        <StatProgression
          title="Chutes"
          data={shotsCardProgression}
          icon={<GiSoccerKick fill="gray" />}
        />

        <StatProgression
          title="Chutes a Gol"
          data={shotsOnCardProgression}
          icon={<GiSoccerKick fill="green" />}
        />

        <StatProgression
          title="Chutes Fora"
          data={shotsOffCardProgression}
          icon={<GiSoccerKick fill="yellow" />}
        />

        <StatProgression
          title="Chutes Bloqueados"
          data={blockedShotsCardProgression}
          icon={<Ban />}
        />

        <StatProgression
          title="Chutes dentro da Área"
          data={shotsInsideCardProgression}
          icon={<Inbox />}
        />

        <StatProgression
          title="Chutes fura da Área"
          data={shotsOutsideCardProgression}
          icon={<Box />}
        />

        <StatProgression
          title="Faltas"
          data={foulsCardProgression}
          icon={<AlertTriangle color="yellow" />}
        />

        <StatProgression
          title="Escanteios"
          data={cornersCardProgression}
          icon={<Flag />}
        />

        <StatProgression
          title="Impedimentos"
          data={offsidesCardProgression}
          icon={<FlagOff fill="orange" />}
        />

        <StatProgression
          title="Posse de Bola"
          data={ballPossessionCardProgression}
          label="%"
          icon={<GiSoccerKick fill="blue" />}
        />

        <StatProgression
          title="Passes"
          data={passesCardProgression}
          icon={<TrendingUp fill="blue" />}
        />

        <StatProgression
          title="Precisão Passes"
          data={accuracyCardProgression}
          label="%"
          icon={<TrendingUp fill="blue" />}
        />

        <StatProgression
          title="Defesas"
          data={savesCardProgression}
          icon={<GiGoalKeeper fill="blue" />}
        />
      </div>
    </div>
  );
}
