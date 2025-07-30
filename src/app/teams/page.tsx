"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Team } from "@/types/Team";
import Link from "next/link";

export default function TeamsListPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/team/");
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Erro ao buscar times:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <p>Carregando times...</p>;
  if (error) return <p>Erro ao carregar times.</p>;

  return (
    <div className="container my-5">

      <div className="row justify-content-center">
        {teams.map((team: Team) => (
          <Link
            href={`/team/${team.id}`}
            key={team.id}
            className="card mb-3"
            style={{
              maxWidth: "500px",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              key={team.id}
              className="card-body d-flex align-items-center justify-content-between"
            >
              <Image
                alt="Logo do time"
                src={team.photo_url}
                width={60}
                height={60}
                className="rounded-circle"
                style={{ objectFit: "cover" }}
              />
              <h2>{team.name}</h2>
              <p>{team.country}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
