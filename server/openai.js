import OpenAI from "openai";
const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` })

async function main(user_input) {
  const history = []

  // while (true) {
  const messages = []
  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text })
    messages.push({ role: "assistant", content: completion_text })
  }

  messages.push({ role: "user", content: user_input })

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    })

    let completion_text = completion.choices[0].message.content
    console.log(completion_text, "-----------------------------------")
    history.push([user_input, completion_text])
    return { results: completion_text }
  } catch (error) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }
  // }
}


export default main;