"use client";

import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Série A",
    price: "R$ 34,99",
    previousMatches: 3,
    playersPerDay: 30,
    teamsPerDay: 25,
    highlighted: false,
  },
  {
    name: "Libertadores",
    price: "R$ 69,99",
    previousMatches: 5,
    playersPerDay: 50,
    teamsPerDay: 45,
    highlighted: true,
  },
  {
    name: "Mundial",
    price: "R$ 99,99",
    previousMatches: 7,
    playersPerDay: "∞",
    teamsPerDay: "∞",
    highlighted: false,
  },
];

export default function PlanosPage() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Planos e Preços</h1>
      <div className="row g-4 justify-content-center">
        {plans.map((plan, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div
              className={`card h-100 shadow-sm ${
                plan.highlighted ? "border border-danger" : ""
              }`}
            >
              <div className="card-body d-flex flex-column">
                <h4 className="text-center">{plan.name}</h4>
                <h2 className="text-center text-danger my-3">{plan.price}</h2>
                <ul className="list-unstyled flex-grow-1">
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    {plan.previousMatches} partidas anteriores
                  </li>
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    {plan.playersPerDay} jogadores analisados/dia
                  </li>
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <CheckCircle className="text-success" size={16} />
                    {plan.teamsPerDay} times analisados/dia
                  </li>
                </ul>
                <button
                  className={`btn mt-auto ${
                    plan.highlighted ? "btn-danger" : "btn-outline-danger"
                  }`}
                >
                  Escolher plano
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
