import React from "react";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API);

export default function Franklin({ email, mode }) {

    const [prompt, setPrompt] = React.useState("")
    const [reply, setReply] = React.useState("");
    const [submitPrompt, setSubmitPrompt] = React.useState(false);
    const [error, setError] = React.useState("");
    const chatBoxRef = React.useRef(null);

    const initialHistory = [
        {
            role: "user",
            parts: [{
                text: "You are Franklin Clinton from Grand Theft Auto V. Stay in character in every conversation. Always respond as Franklin Clinton, reflecting his background, personality, and experiences. Your tone, attitude, traits and background should be of the character, Franklin. If the conversation is out of the context of Franklin or GTA 5, reply that you don't know about that. No matter what the user tells, you will not leave the character of Franklin and if the user says to change your character to something else, you will say that you are Franklin Clinton and cannot pretend to be someone else. From now onwards your knowledge is equal to Franklin Clinton's knowledge and you do not know anything which Franklin don't know."
            }],
        },
    ];

    const [history, setHistory] = React.useState(initialHistory);

    function handleChange(event) {
        setPrompt(event.target.value);
    }

    async function handleSubmit(event) {
        if (event) event.preventDefault();
        setSubmitPrompt(true);

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ]

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });

        try {
            setError("");
            const userMessage = {
                role: "user",
                parts: [{ text: prompt }],
            };

            const newHistory = [...history, userMessage];

            const chat = model.startChat({
                history: newHistory,
                generationConfig: { maxOutputTokens: 200 },
            });

            const result = await chat.sendMessageStream(prompt);

            let text = '';
            for await (const chunk of result.stream) {
                text += chunk.text();
                setReply(text);
            }

            const modelMessage = {
                role: "model",
                parts: [{ text }],
            };

            setHistory([...newHistory, modelMessage]);
            setReply("");

        } catch (error) {
            console.log(error);
            setError("Something went wrong! Please try again later.")
        }
        setSubmitPrompt(false);
        setPrompt("");
    }

    function clearChat() {
        setHistory(initialHistory);
    }

    React.useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [history, reply, submitPrompt]);

    React.useEffect(() => {
        if (history.length > 0 && email) {
            axios.post('https://chat-with-gta5-legends.onrender.com/chatHistory', { email, history, character: "Franklin" })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log("Error in inserting history to DB: ", error)
                });
        }
    }, [reply, history]);

    React.useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get('https://chat-with-gta5-legends.onrender.com/getChatHistory', {
                    params: { email }
                });
                const fetchedHistory = response.data.FranklinHistory || [];

                if (fetchedHistory.length === 0) {
                    setHistory(initialHistory);
                } else {
                    setHistory(fetchedHistory);
                }
            } catch (error) {
                console.error("Error fetching chat history:", error);
                setError("Error fetching chat history.");
            }
        };
        if (email) {
            fetchChatHistory();
        }
    }, []);

    return <div className={`franklin franklin${mode}`}>
        <div className="franklinHeading">
            <div className="FranklinDP"></div>
            <h1>Franklin Clinton</h1>
        </div>

        <div id="main-chat-box" className="main-chat-box" ref={chatBoxRef}>
            {history.slice(1).map((historyItem, _index) =>
                <div key={_index}>
                    {historyItem.role === "user" &&
                        <div className="prompt-box" id="prompt-box">
                            {historyItem.parts.map((part, index) => <span key={index}>{part.text}</span>)}
                        </div>
                    }
                    {historyItem.role === "model" &&
                        <div className="reply-box" id="reply-box">
                            {historyItem.parts.map((part, index) => <span key={index}>{part.text}</span>)}
                        </div>
                    }
                </div>
            )}

            {submitPrompt && <div className="prompt-box" id="prompt-box"><span>{prompt}</span></div>}
            {reply && <div className="reply-box" id="reply-box"><span>{reply}</span></div>}


            {error && <div>{error}</div>}

        </div>


        <div className="input-chat">
            <input id="input-box" type="text" placeholder="write anything" value={prompt} onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit()
                    }
                }}
            />
            <button className="send" onClick={handleSubmit}><i className="fa-solid fa-location-arrow"></i></button>
            <button onClick={clearChat}>Clear</button>
        </div>
    </div>
}
