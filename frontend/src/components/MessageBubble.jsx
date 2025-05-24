import ReactMarkdown from "react-markdown"

const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user"

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    isUser 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-800"
                }`}
            >
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            code: ({node, ...props}) => <code className="bg-gray-200 rounded px-1" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-gray-200 rounded p-2 mb-2 overflow-x-auto" {...props} />,
                            hr: ({node, ...props}) => <hr className="my-4 border-gray-300" {...props} />,
                        }}
                    >
                        {message.text}
                    </ReactMarkdown>
                </div>
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
