const { HumanMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const { getContextVariable } = require("@langchain/core/context");
const { model } = require("../utils");

const chatCustomTool = async ({ content }) => {
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
      description: "Adds two numbers together!",
      schema: adderSchema,
    }
  );

  const multiplyTool = tool(
    async (input) => {
      const userId = getContextVariable("userId");
      //validate Error
      if (userId === undefined) {
        console.log(
          `No "userId" found in current context. Remember to call "setContextVariable('userId', value)";`
        );
      }
      const multiple = input.a * input.b;
      return `The multiple of ${input.a} and ${input.b} is ${multiple}`;
    },
    {
      name: "multiplyTool",
      description: "Multiples two numbers together!",
      schema: multipleSchema,
    }
  );

  const tools = [addTool, multiplyTool];

  const res = await model.bindTools(tools).invoke([new HumanMessage(content)]);

  const toolsByName = {
    addTool: addTool,
    multiplyTool: multiplyTool,
  };
  const messages = [];

  for (const toolCall of res.tool_calls) {
    const selectedTool = toolsByName[toolCall.name];
    const toolMessage = await selectedTool.invoke(toolCall.args);
    console.log("toolMessage: ", toolMessage);
    messages.push(toolMessage);
  }
  console.log("messages:", messages);
  return messages;
};

module.exports = {
  chatCustomTool,
};
