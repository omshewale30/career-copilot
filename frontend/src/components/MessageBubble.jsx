import ReactMarkdown from "react-markdown"

const MessageBubble = ({ message, previousSender }) => {
    const isUser = message.sender === "user"
    const isNewBlock = previousSender && previousSender !== message.sender
    const baseMargin = "mb-6"
    const extraTopMargin = isNewBlock ? "mt-6" : ""

    if (isUser) {
        // User message: right, bubble, dark bg, white text, smaller font
        return (
            <div className={`flex justify-end ${baseMargin} ${extraTopMargin}`}>
                <div className="max-w-[75%] bg-gray-800 text-white rounded-full px-6 py-3 text-sm leading-relaxed font-sans shadow-md">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                    {message.component && (
                        <div className="mt-4">{message.component}</div>
                    )}
                </div>
            </div>
        )
    } else {
        // AI message: left, no bg, wide, white text, slightly larger font
        return (
            <div className={`flex justify-start ${baseMargin} ${extraTopMargin}`}>
                <div className="w-[90%] max-w-3xl text-white text-base leading-relaxed font-sans">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                    {message.component && (
                        <div className="mt-4">{message.component}</div>
                    )}
                </div>
            </div>
        )
    }
}

export default MessageBubble
