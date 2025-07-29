"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <div className="d-flex align-items-center gap-4">
          <Link className="navbar-brand" href="/">
            BetStats
          </Link>

          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link" href="/players">
                Jogadores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/teams">
                Times
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center ms-auto">
          <Link href="/conta" className="nav-link text-white">
            <i className="bi bi-person-circle fs-4"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
