import ReactMarkdown from "react-markdown"


const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user" // Check if the message is from the user
    const messageClasses = isUser
        ? "bg-blue-600 text-white rounded-lg p-3 max-w-[80%] self-end" // User's message style
        : "bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%] self-start" // Agent's message style

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div className={messageClasses}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
        </div>
    )
}

export default MessageBubble
