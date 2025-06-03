const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const CONTEXTO =
  "Você é um professor de matemática do ensino médio. Responda de forma clara, simples e objetiva.";

app.post("/perguntar", async (req, res) => {
  const { pergunta } = req.body;
  if (!pergunta)
    return res.status(400).json({ erro: "A pergunta é obrigatória." });

  try {
    const resposta = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
      {
        inputs: `${CONTEXTO}\n\nPergunta: ${pergunta}\nResposta:`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const output = resposta.data[0]?.generated_text || "Sem resposta.";
    res.json({ resposta: output });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao consultar o modelo LLM." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
