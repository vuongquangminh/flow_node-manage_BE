const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage } = require("@langchain/core/messages");

const langChainBot = async () => {
  const modelForFunctionCalling = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0,
    apiKey:
      "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", // In Node.js defaults to process.env.OPENAI_API_KEY
  });
  function get_current_weather({ location, days }) {
    // Gọi API thật đến dịch vụ thời tiết (ví dụ OpenWeatherMap)
    // hoặc giả lập data nếu đang test
    return {
      temperature: 27,
      condition: "Weather",
      location,
      days,
    };
  }

  function get_forecast_weather({ location, days }) {
    // Gọi API thật đến dịch vụ thời tiết (ví dụ OpenWeatherMap)
    // hoặc giả lập data nếu đang test
    return {
      temperature: 27,
      condition: "Forecast",
      location,
      days,
    };
  }

  const res = await modelForFunctionCalling.invoke(
    [new HumanMessage("Dự báo thời tiết ở Mỹ trong tuần này")],
    {
      functions: [
        {
          name: "get_current_weather",
          description: "Get the current weather in a given location",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string", description: "City and country" },
              days: {
                type: "integer",
                description: "Number of days to forecast (max 7)",
              },
            },
            required: ["location"],
          },
        },
        {
          name: "get_forecast_weather",
          description: "Get the 7-day weather forecast for a given location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
              unit: { type: "string", enum: ["celsius", "fahrenheit"] },
            },
            required: ["location"],
          },
        },
      ],
    }
  );
  const functionCall = res.additional_kwargs.function_call;

  if (functionCall?.name === "get_current_weather") {
    const args = JSON.parse(functionCall.arguments);
    const data = await get_current_weather(args);
    console.log("Weather now:", data);
  } else if (functionCall?.name === "get_forecast_weather") {
    const args = JSON.parse(functionCall.arguments);
    const data = await get_forecast_weather(args);
    console.log("7-day forecast:", data);
  }
};

module.exports = { langChainBot };
