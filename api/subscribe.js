import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email } = req.body;

  // Validación simple
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Insertar en la DB
  const { error } = await supabase
    .from("emails")
    .insert({ email });

  if (error) {
    // Si ya existe, no es un error grave
    if (error.code === "23505") {
      return res.status(200).json({ ok: true, message: "Email ya registrado" });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ ok: true });
}