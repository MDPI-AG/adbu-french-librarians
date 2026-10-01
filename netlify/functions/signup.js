const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Méthode non autorisée.",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, {
      error: "Requête invalide.",
    });
  }

  if (payload.company) {
    return jsonResponse(200, { ok: true });
  }

  const title = String(payload.title || "").trim();
  const firstname = String(payload.firstname || "").trim();
  const lastname = String(payload.lastname || "").trim();
  const email = String(payload.email || "").trim();

  if (!title || !firstname || !lastname || !email) {
    return jsonResponse(400, {
      error: "Veuillez renseigner tous les champs obligatoires.",
    });
  }

  if (!EMAIL_RE.test(email)) {
    return jsonResponse(400, {
      error: "Veuillez indiquer une adresse e-mail valide.",
    });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.SIGNUP_SECRET;

  if (!scriptUrl || !secret) {
    return jsonResponse(503, {
      error:
        "Le service d’inscription n’est pas encore configuré. Réessayez plus tard.",
    });
  }

  try {
    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        title,
        firstname,
        lastname,
        email,
      }),
      redirect: "follow",
    });

    const text = await upstream.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      data = { raw: text };
    }

    if (!upstream.ok || data.ok === false) {
      return jsonResponse(502, {
        error:
          data.error ||
          "L’inscription n’a pas pu être enregistrée. Réessayez plus tard.",
      });
    }

    return jsonResponse(200, { ok: true });
  } catch (error) {
    return jsonResponse(502, {
      error:
        "Impossible de joindre le service d’inscription. Réessayez plus tard.",
    });
  }
};
