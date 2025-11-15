export default async function handler(req, res) {
  try {
    const backendUrl =
      "https://my-own-space-backend.onrender.com/api/auth/server/alive";

    await fetch(backendUrl);

    res.status(200).json({ ok: true, ping: backendUrl });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}
