// import Sidebar from "@/components/Sidebar";
// import React from "react";
// import Chat from "@/components/Chat";
//
// interface ChatProps {
//     searchParams: {
//         chatId?: string
//     }
// }
//
// const ChatPage = ({ searchParams }: ChatProps) => {
//     const chatId = searchParams.chatId;
//
//     return (
//         <div className="flex h-screen bg-[#121212] text-[#eaeaea]">
//             <Sidebar />
//             <div className="flex-1 p-4">
//                 {
//                     chatId ? (
//                         <Chat chatId={chatId} />
//                     ) : (
//                         <p>Select a chat to start messaging</p>
//                     )
//                 }
//             </div>
//         </div>
//     );
// }
//
// export default ChatPage;

import Sidebar from "@/components/Sidebar";
import React from "react";
import Chat from "@/components/Chat";

interface ChatProps {
    searchParams: {
        chatId?: string;
    };
}

const ChatPage = ({ searchParams }: ChatProps) => {
    const chatId = searchParams.chatId;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#121212] text-[#eaeaea]">
            <div className="md:w-64 w-full md:h-full h-1/2 border-b md:border-b-0 md:border-r border-[#333]">
                <Sidebar />
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {chatId ? (
                    <Chat chatId={chatId} />
                ) : (
                    <p className="text-center text-sm md:text-base">Select a chat to start messaging</p>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
