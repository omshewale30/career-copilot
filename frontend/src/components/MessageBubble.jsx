import ReactMarkdown from "react-markdown"


const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user" // Check if the message is from the user

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
            >
                <p className="text-sm">{message.text}</p>
                {message.component && (
                    <div className="mt-4">
                        {message.component}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBubble
