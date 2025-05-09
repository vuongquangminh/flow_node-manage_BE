const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");

const langChainBot = async () => {
  const modelForFunctionCalling = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0,
  });

  const adderSchema = z.object({
    a: z.number(),
    b: z.number(),
  });

  const multipleSchema = z.object({
    a: z.number(),
    b: z.number(),
  });

  const addTool = tool(
    async (input) => {
      const sum = input.a + input.b;
      return `The sum of ${input.a} and ${input.b} is ${sum}`;
    },
    {
      name: "addTool",
      description: "Adds two numbers together",
      schema: adderSchema,
    }
  );

  const multiplyTool = tool(
    async (input) => {
      const multiple = input.a * input.b;
      return `The multiple of ${input.a} and ${input.b} is ${multiple}`;
    },
    {
      name: "multiplyTool",
      description: "Multiples two numbers together",
      schema: multipleSchema,
    }
  );

  const tools = [addTool, multiplyTool];

  const res = await modelForFunctionCalling
    .bindTools(tools)
    .invoke([new HumanMessage("What is 3 * 12? Also, what is 11 + 49?")]);

  const toolsByName = {
    addTool: addTool,
    multiplyTool: multiplyTool,
  };
  const messages = [];

  for (const toolCall of res.tool_calls) {
    const selectedTool = toolsByName[toolCall.name];
    const toolMessage = await selectedTool.invoke(toolCall.args);
    console.log(('toolMessage: ', toolMessage))
    messages.push(toolMessage);
  }
  console.log("Tool results:", messages);
};

module.exports = { langChainBot };
