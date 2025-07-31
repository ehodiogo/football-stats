import Image from "next/image";
import { Team } from "@/types/Team";

export default function TeamCard({ team }: { team: Team }) {
  return (
    <div className="card shadow-sm w-100">
      <div className="row g-0 align-items-center">
        <div className="col-auto ps-3">
          <Image
            src={team.photo_url}
            alt={team.name}
            width={100}
            height={100}
            className="img-fluid rounded-start"
            style={{ objectFit: "cover", width: "100px", height: "100px" }}
          />
        </div>

        <div className="col px-3">
          <div className="card-body">
            <h5 className="card-title mb-1">{team.name}</h5>

            <p className="card-text mb-0">
              <strong>Fundado:</strong> {team.founded}
            </p>
            <p className="card-text mb-0">
              <strong>País:</strong> {team.country}
            </p>
            <p className="card-text">
              <strong>Código:</strong> {team.code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
