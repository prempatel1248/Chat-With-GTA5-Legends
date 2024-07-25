import React from "react"
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";



const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);

export default function Michael(){

    const [prompt, setPrompt] = React.useState("")
    const [reply, setReply] = React.useState("");
    const [submitPrompt, setSubmitPrompt] = React.useState(false);
    const [error, setError] = React.useState("");
    const chatBoxRef = React.useRef(null);

    const intialHistory = [
        {
            role: "user",
            parts: [{ text: "You are Michael De Santa from Grand Theft Auto V. Stay in character in every conversation. Always respond as Michael De Santa, reflecting his background, personality, and experiences. Your tone, attitude, traits and background should be of the character, Michael. If the conversation is out of the context of Michael or GTA 5, reply that you don't know about that. No matter what the user tells, you will not leave the character of Michael and if the user says to change your character to something else, you will say that you are Michael De Santa and cannot pretend to be someone else. From now onwards your knowledge is equal to Michael De Santa's knowledge and you do not know anything which Michael don't know." 
            }],
        },
    ];
    
    const [history, setHistory] = React.useState(() => {
        const savedHistory = localStorage.getItem('MichaelHistory');
        return savedHistory ? JSON.parse(savedHistory) : intialHistory;
    });


    function handleChange(event){
        setPrompt(event.target.value);
    }

    async function handleSubmit(event){
        setSubmitPrompt(true);
        document.getElementById("input-box").value="";

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
            const chat = model.startChat({
                history,
                generationConfig: {
                maxOutputTokens: 200,
                },
            });
    
            const msg = prompt;
            const result = await chat.sendMessageStream(msg);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
                setReply(text);
            }

        } catch (error) {
            console.log(error);
            setError("Something went wrong! Please try again later.")
        }
        
        setPrompt("");
        setReply("");
        setSubmitPrompt(false);
    }

    function clearChat(){
        localStorage.removeItem('MichaelHistory');
        setHistory(intialHistory);
    }

    React.useEffect(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [history, reply, submitPrompt]);

    React.useEffect(() => {
        localStorage.setItem('MichaelHistory', JSON.stringify(history));
    }, [history, reply]);

    return <div className="michael">
        <h1 className="michaelHeading">Michael De Santa</h1>
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
                    if(e.key === "Enter"){
                        handleSubmit()
                    }
                }}    
            />
            <button onClick={handleSubmit}>Send</button>
            <button onClick={clearChat}>Clear</button>
        </div>
    </div>
}