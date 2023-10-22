import OpenAI from "openai";
import {Request, Response} from "express";

const generatePrompt = () => {
  return (
    `You are developer GPT, expert in software engineering and programming.`
  )
}


export async function handler(req: Request, res: Response) {
  try {
    const {messages} = req.body;


    // update to use parameters from the request to personalize the prompt
    const systemPrompt = generatePrompt();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      stream: false,
    });

    const result = completion.choices[0].message;
    if (!result || !result?.content) {
      throw Error("No result");
    } else {
      console.log(result);

      res.status(200).send(result);
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}