// const { initializeAgentExecutorWithOptions } = require("langchain/agents");
// const { ChatOpenAI } = require("@langchain/openai");
// const {
//   GmailCreateDraft,
//   GmailGetMessage,
//   GmailGetThread,
//   GmailSearch,
//   GmailSendMessage,
// } = require("@langchain/community/tools/gmail");
// const { StructuredTool } = require("@langchain/core/tools");

// const model = new ChatOpenAI({
//   model: "gpt-3.5-turbo",
//   temperature: 0,
//   cache: true,
// });

// let chatHistory = [];
// const aiAgent = async () => {
//   // For custom parameters, uncomment the code above, replace the values with your own, and pass it to the tools below
//   const tools = [
//     new GmailCreateDraft(),
//     new GmailGetMessage(),
//     new GmailGetThread(),
//     new GmailSearch(),
//     new GmailSendMessage(),
//   ];

//   const gmailAgent = await initializeAgentExecutorWithOptions(tools, model, {
//     agentType: "structured-chat-zero-shot-react-description",
//     verbose: true,
//   });

//   const createInput = `Create a gmail draft for me to edit of a letter from the perspective of a sentient parrot who is looking to collaborate on some research with her estranged friend, a cat. Under no circumstances may you send the message, however.`;

//   const createResult = await gmailAgent.invoke({ input: createInput });
//   //   Create Result {
//   //     output: 'I have created a draft email for you to edit. The draft Id is r5681294731961864018.'
//   //   }
//   console.log("Create Result", createResult);

//   const viewInput = `Could you search in my drafts for the latest email?`;

//   const viewResult = await gmailAgent.invoke({ input: viewInput });
//   //   View Result {
//   //     output: "The latest email in your drafts is from hopefulparrot@gmail.com with the subject 'Collaboration Opportunity'. The body of the email reads: 'Dear [Friend], I hope this letter finds you well. I am writing to you in the hopes of rekindling our friendship and to discuss the possibility of collaborating on some research together. I know that we have had our differences in the past, but I believe that we can put them aside and work together for the greater good. I look forward to hearing from you. Sincerely, [Parrot]'"
//   //   }
//   console.log("View Result", viewResult);
// };

// module.exports = { aiAgent };
