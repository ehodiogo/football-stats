import Image from "next/image";
import { Player } from "@/types/Player";

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="card shadow-sm w-100">
      <div className="row g-0 align-items-center">
        {/* Foto do jogador */}
        <div className="col-auto ps-3">
          <Image
            src={player.photo_url}
            alt={player.name}
            width={100}
            height={100}
            className="img-fluid rounded-start"
            style={{ objectFit: "cover", width: "100px", height: "100px" }}
          />
        </div>

        <div className="col px-3">
          <div className="card-body">
            <h5 className="card-title mb-1">{player.name}</h5>

            <p className="card-text mb-0">
              <strong>Posição:</strong> {player.position}
            </p>
            <p className="card-text mb-0">
              <strong>Nacionalidade:</strong> {player.nationality}
            </p>
            <p className="card-text">
              <strong>Nº Camisa:</strong> {player.number}
            </p>
          </div>
        </div>

        <div className="col-auto pe-3">
          <div className="d-flex flex-column align-items-end">
            <Image
              src={player.actual_team.photo_url}
              alt={player.actual_team.name}
              width={40}
              height={40}
              className="img-fluid mb-1"
              style={{ objectFit: "contain" }}
            />
            <small className="text-muted">{player.actual_team.name}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
