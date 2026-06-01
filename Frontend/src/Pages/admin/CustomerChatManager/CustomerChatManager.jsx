import React, { useState, useMemo, useEffect } from 'react';

const CHAT_DATA = [
    {
        id: 1,
        customerName: "Nguyễn Thị Lan",
        avatar: "https://i.pravatar.cc/150?u=lan",
        lastMessage: "Tour Hạ Long còn chỗ không ạ? Em muốn book cho gia đình 4 người vào tuần sau.",
        time: "09:42",
        unread: 3,
        status: "online",
        tourName: "Vịnh Hạ Long 3N2Đ"
    },
    {
        id: 2,
        customerName: "Trần Minh Quân",
        avatar: "https://i.pravatar.cc/150?u=quan",
        lastMessage: "Mình muốn đổi ngày khởi hành sang 25/04 được không?",
        time: "09:15",
        unread: 0,
        status: "offline",
        tourName: "Phú Quốc Beach Resort 4N3Đ"
    },
    {
        id: 3,
        customerName: "Lê Hoàng Nam",
        avatar: "https://i.pravatar.cc/150?u=nam",
        lastMessage: "Cảm ơn anh, mình đã chuyển khoản rồi ạ.",
        time: "08:55",
        unread: 1,
        status: "online",
        tourName: "Fansipan Sapa 2N1Đ"
    },
    {
        id: 4,
        customerName: "Phạm Thu Hà",
        avatar: "https://i.pravatar.cc/150?u=ha",
        lastMessage: "Tour Đà Lạt có giảm giá cho nhóm 4 người không?",
        time: "Hôm qua",
        unread: 0,
        status: "offline",
        tourName: "Đà Lạt mùa hoa 3N2Đ"
    },
    {
        id: 5,
        customerName: "Phạm Thu Hà",
        avatar: "https://i.pravatar.cc/150?u=ha",
        lastMessage: "Tour Đà Lạt có giảm giá cho nhóm 4 người không?",
        time: "Hôm qua",
        unread: 0,
        status: "offline",
        tourName: "Đà Lạt mùa hoa 3N2Đ"
    },
];

export default function CustomerChatManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const filteredChats = useMemo(() => {
        if (!searchTerm.trim()) return CHAT_DATA;
        const term = searchTerm.toLowerCase();
        return CHAT_DATA.filter(chat =>
            chat.customerName.toLowerCase().includes(term) ||
            chat.tourName.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    useEffect(() => {
        if (selectedChat) {
            setMessages([
                {
                    id: 1,
                    text: "Chào chị Lan, em là hỗ trợ viên của Lối Riêng Travel. Em có thể hỗ trợ chị hôm nay không ạ?",
                    isAdmin: true,
                    time: "09:30"
                },
                {
                    id: 2,
                    text: selectedChat.lastMessage,
                    isAdmin: false,
                    time: selectedChat.time
                },
            ]);
        }
    }, [selectedChat]);

    const sendMessage = () => {
        if (!message.trim() || !selectedChat) return;

        setMessages(prev => [...prev, {
            id: Date.now(),
            text: message,
            isAdmin: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        setMessage('');
    };

    return (
        <div className='space-y-6 p-4 my-[10px] h-auto bg-gray-100/50 rounded-2xl'>
            <div className="h-[calc(90vh-80px)]  border border-slate-200 flex overflow-hidden bg-slate-100 rounded-2xl ">
                {/* Sidebar Chat List */}
                <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
                    <div className="p-5">
                        <h2 className="font-bold text-xl text-slate-800">Hỗ trợ khách hàng</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {filteredChats.length} cuộc trò chuyện
                        </p>
                    </div>

                    {/* Search */}
                    <div className="p-4 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm khách hàng..."
                                className="w-full pl-11 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        </div>
                    </div>

                    {/* Danh sách chat */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`px-5 py-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-all ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={chat.avatar}
                                            alt={chat.customerName}
                                            className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-100"
                                            
                                        />
                                        
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h4 className="font-semibold text-slate-900 truncate pr-2">{chat.customerName}</h4>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">{chat.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-tight">{chat.lastMessage}</p>
                                    </div>

                                    {chat.unread > 0 && (
                                        <div className="bg-blue-600 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white min-w-0">
                    {selectedChat ? (
                        <>
                            {/* Header */}
                            <div className="px-6 py-4  flex items-center gap-4 bg-gray-100/50 ">
                                <img
                                    src={selectedChat.avatar}
                                    alt={selectedChat.customerName}
                                    className="w-11 h-11 rounded-2xl object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-slate-800">{selectedChat.customerName}</h3>
                                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Đang hoạt động
                                    </div>
                                </div>
                                {/* <div className="text-right">
                                    <p className="text-xs text-slate-500">Đang hỗ trợ tour</p>
                                    <p className="font-medium text-slate-700 text-sm">{selectedChat.tourName}</p>
                                </div> */}
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-7 min-w-0">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex min-w-0 ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        {/* FIX: thêm style overflowWrap: 'anywhere' để xử lý chuỗi dài không có khoảng trắng */}
                                        <div
                                            className={`max-w-[70%] px-5 py-3.5 rounded-3xl text-[13px] leading-relaxed break-words ${msg.isAdmin
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white border border-slate-200 rounded-bl-none'
                                                }`}
                                            style={{ overflowWrap: 'anywhere' }}
                                        >
                                            {msg.text}
                                            <div className={`text-[10px] mt-2 opacity-75 ${msg.isAdmin ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {msg.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-5 bg-white">
                                <div className="bg-white border border-slate-200 rounded-3xl px-5 py-2 flex items-center shadow-sm">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Nhập tin nhắn trả lời khách hàng..."
                                        className="flex-1 bg-transparent outline-none text-[13px] py-3 px-2"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!message.trim()}
                                        className="ml-2 w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
                                    >
                                        ↑
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                                <p className="text-slate-500 mt-3 max-w-sm">Chọn một khách hàng từ danh sách bên trái để bắt đầu hỗ trợ</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}