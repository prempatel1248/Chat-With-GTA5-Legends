const msg = "I have 3 cats";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);