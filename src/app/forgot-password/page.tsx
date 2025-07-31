"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Enviar email para:", email);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Recuperar Senha</h1>
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Enviar
        </button>
        <div className="mt-4 text-sm text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Voltar ao login
          </Link>
        </div>
      </form>
    </div>
  );
}
