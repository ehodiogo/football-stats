"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Player } from "@/types/Player";

export default function PlayerPage() {
  const [busca, setBusca] = useState("");
  const [jogadores, setJogadores] = useState<Player[]>([]);

  useEffect(() => {
    async function buscarJogadores() {
      if (busca.trim() === "") {
        setJogadores([]);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/player?search=${busca}`
        );
        const data = await response.json();
        setJogadores(data);
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    }

    const delayDebounce = setTimeout(() => {
      buscarJogadores();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [busca]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Buscar Jogadores</h1>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Digite o nome do jogador"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="row justify-content-center">
        {jogadores.map((jogador) => (
          <Link
            href={`/player/${jogador.id}`}
            key={jogador.id}
            className="card mb-3"
            style={{
              maxWidth: "500px",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="card-body d-flex align-items-center justify-content-between">
              <Image
                src={jogador.photo_url}
                alt={`Foto de ${jogador.name}`}
                width={60}
                height={60}
                className="rounded-circle"
                style={{ objectFit: "cover" }}
              />

              <div className="text-center flex-grow-1 px-2">
                <h5 className="card-title mb-1">{jogador.name}</h5>
                {jogador.actual_team && (
                  <p className="card-text mb-0">
                    Time: {jogador.actual_team.name}
                  </p>
                )}
              </div>

              {jogador.actual_team?.photo_url && (
                <Image
                  src={jogador.actual_team.photo_url}
                  alt={`Logo do ${jogador.actual_team.name}`}
                  width={40}
                  height={40}
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
