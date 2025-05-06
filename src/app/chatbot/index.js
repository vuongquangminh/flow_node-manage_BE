import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));

module.exports = {}