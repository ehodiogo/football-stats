"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Player } from "@/types/Player";
import { PlayerStatistic } from "@/types/PlayerStatistic";
import {
  RectangleVertical,
  Clock,
  FlagOff,
  Star,
  Users,
  TrendingUp,
  Dumbbell,
  ShieldBan,
  Joystick,
  AlertTriangle,
  Hand,
  Target,
  XCircle,
  Shield,
  Ban
} from "lucide-react";
import { FaPeoplePulling } from "react-icons/fa6";
import { GiGoalKeeper, GiSoccerKick, GiSoccerBall, } from "react-icons/gi";
import StatProgression from "@/app/functions/statProgression";
import PlayerCard from "@/app/components/PlayerCard";
import Link from "next/link";

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

  const yellowCardProgression = statistics?.map((s) => s.yellow_card) || [];
  const redCardProgression = statistics?.map((s) => s.red_card) || [];
  const minPlayedCardProgression = statistics?.map((s) => s.min_played) || [];
  const offsidesCardProgression = statistics?.map((s) => s.offsides) || [];
  const ratingCardProgression = statistics?.map((s) => s.rating) || [];
  const shotsCardProgression = statistics?.map((s) => s.shots) || [];
  const shotsOnGoalCardProgression = statistics?.map((s) => s.shots_on_goal) || [];
  const goalsCardProgression = statistics?.map((s) => s.goals) || [];
  const goalsConcedeedCardProgression = statistics?.map((s) => s.goals_conceded) || [];
  const assistsCardProgression = statistics?.map((s) => s.assists) || [];
  const savesCardProgression = statistics?.map((s) => s.saves) || [];
  const passesCardProgression = statistics?.map((s) => s.passes) || [];
  const accuracyCardProgression = statistics?.map((s) => s.accuracy) || [];
  const duelsCardProgression = statistics?.map((s) => s.duels) || [];
  const duelsWonCardProgression = statistics?.map((s) => s.duels_won) || [];
  const tacklesCardProgression = statistics?.map((s) => s.tackles) || [];
  const blocksCardProgression = statistics?.map((s) => s.blocks) || [];
  const interceptionsCardProgression = statistics?.map((s) => s.interceptions) || [];
  const dribblesAttemptCardProgression = statistics?.map((s) => s.dribbles_attempts) || [];
  const dribblesSuccessCardProgression = statistics?.map((s) => s.dribbles_success) || [];
  const dribblesPastCardProgression = statistics?.map((s) => s.dribbles_past) || [];
  const foulsDrownCardProgression = statistics?.map((s) => s.fouls_drown) || [];
  const foulsComittedCardProgression = statistics?.map((s) => s.fouls_committed) || [];
  const penaltyWonCardProgression = statistics?.map((s) => s.penalty_won) || [];
  const penaltyCommittedCardProgression = statistics?.map((s) => s.penalty_committed) || [];
  const penaltyScoredCardProgression = statistics?.map((s) => s.penalty_scored) || [];
  const penaltyMissedCardProgression = statistics?.map((s) => s.penalty_missed) || [];
  const penaltySavedCardProgression = statistics?.map((s) => s.penalty_saved) || [];

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <PlayerCard player={player} />

      <section className="mt-4">
        <h2 className="h4 mb-3 text-center">Times Anteriores</h2>

        {player.last_teams.length > 0 ? (
          <div className="d-flex justify-content-center">
            <div
              className="d-flex overflow-auto"
              style={{ gap: "1rem", padding: "0.5rem 0", maxWidth: "100%" }}
            >
              {player.last_teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/team/${team.id}`}
                  passHref
                  className="text-decoration-none"
                >
                  <div
                    className="flex-shrink-0 bg-light rounded shadow-sm d-flex align-items-center justify-content-center"
                    title={team.name}
                    style={{ width: 80, height: 80, cursor: "pointer" }}
                  >
                    <Image
                      src={team.photo_url}
                      alt={`Logo do ${team.name}`}
                      width={64}
                      height={64}
                      className="object-contain"
                      unoptimized={true}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center fst-italic text-muted">
            Sem times anteriores registrados.
          </p>
        )}
      </section>

      <h2 className="mt-4 h4 mb-3 text-center">Últimas Partidas do Jogador</h2>
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
          title="Tempo de Jogo"
          data={minPlayedCardProgression}
          label="min"
          icon={<Clock />}
        />

        <StatProgression
          title="Impedimentos"
          data={offsidesCardProgression}
          icon={<FlagOff fill="orange" />}
        />

        <StatProgression
          title="Rating"
          data={ratingCardProgression}
          icon={<Star fill="yellow" />}
        />

        <StatProgression
          title="Chutes"
          data={shotsCardProgression}
          icon={<GiSoccerKick fill="gray" />}
        />

        <StatProgression
          title="Chutes a Gol"
          data={shotsOnGoalCardProgression}
          icon={<GiSoccerKick fill="green" />}
        />

        <StatProgression
          title="Gols"
          data={goalsCardProgression}
          icon={<GiSoccerBall fill="green" />}
        />

        <StatProgression
          title="Gols Tomados"
          data={goalsConcedeedCardProgression}
          icon={<GiSoccerBall fill="red" />}
        />

        <StatProgression
          title="Assistências"
          data={assistsCardProgression}
          icon={<Users fill="yellow" />}
        />

        <StatProgression
          title="Defesas"
          data={savesCardProgression}
          icon={<GiGoalKeeper fill="blue" />}
        />

        <StatProgression
          title="Passes"
          data={passesCardProgression}
          icon={<GiSoccerKick fill="blue" />}
        />

        <StatProgression
          title="Precisão Passes"
          data={accuracyCardProgression}
          label="%"
          icon={<TrendingUp fill="blue" />}
        />

        <StatProgression
          title="Duelos"
          data={duelsCardProgression}
          icon={<Dumbbell />}
        />

        <StatProgression
          title="Duelos Ganhos"
          data={duelsWonCardProgression}
          icon={<Dumbbell fill="green" />}
        />

        <StatProgression
          title="Desarmes"
          data={tacklesCardProgression}
          icon={<FaPeoplePulling />}
        />

        <StatProgression
          title="Bloqueios"
          data={blocksCardProgression}
          icon={<Ban />}
        />

        <StatProgression
          title="Interceptações"
          data={interceptionsCardProgression}
          icon={<ShieldBan />}
        />

        <StatProgression
          title="Dribles Tentados"
          data={dribblesAttemptCardProgression}
          icon={<Joystick color="yellow" />}
        />

        <StatProgression
          title="Dribles Efetuados"
          data={dribblesSuccessCardProgression}
          icon={<Joystick color="green" />}
        />

        <StatProgression
          title="Dribles Recebidos"
          data={dribblesPastCardProgression}
          icon={<Joystick color="red" />}
        />

        <StatProgression
          title="Faltas Recebidas"
          data={foulsDrownCardProgression}
          icon={<AlertTriangle color="yellow" />}
        />

        <StatProgression
          title="Faltas Cometidas"
          data={foulsComittedCardProgression}
          icon={<ShieldBan color="red" />}
        />

        <StatProgression
          title="Pênalti Recebido"
          data={penaltyWonCardProgression}
          icon={<Hand />}
        />

        <StatProgression
          title="Pênalti Cometido"
          data={penaltyCommittedCardProgression}
          icon={<AlertTriangle color="red" />}
        />

        <StatProgression
          title="Pênalti Marcado"
          data={penaltyScoredCardProgression}
          icon={<Target color="green" />}
        />

        <StatProgression
          title="Pênalti Perdido"
          data={penaltyMissedCardProgression}
          icon={<XCircle color="red" />}
        />

        <StatProgression
          title="Pênalti Defendido"
          data={penaltySavedCardProgression}
          icon={<Shield color="blue" />}
        />
      </div>
    </div>
  );
}
