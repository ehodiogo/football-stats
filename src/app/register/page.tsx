"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Criar Conta</h1>
        <input
          type="text"
          placeholder="Nome"
          className="w-full mb-4 p-3 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="w-full mb-4 p-3 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-4 p-3 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Cadastrar
        </button>
        <div className="mt-4 text-sm text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Já tenho uma conta
          </Link>
        </div>
      </form>
    </div>
  );
}
