import { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.scss';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import icon from '../../assets/3.png';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';

export const Chat = ( cardId ) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const fileUploadRef = useRef<FileUpload>(null);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const apiUrl = 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const connect = async () => {
            const conn = new signalR.HubConnectionBuilder()
                .withUrl(`${apiUrl}/hubs/comments?taskId=${cardId.cardId}`, {
                    accessTokenFactory: () => token,
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .configureLogging(signalR.LogLevel.Debug)
                .withAutomaticReconnect()
                .build();

            conn.on('ReceiveComment', comment => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: comment.commentId,
                        text: comment.text,
                        date: comment.dateCreated,
                        authorId: comment.authorId,
                    },
                ])
            })

            try {
                await conn.start();
                console.log('Connected to SignalR hub');
                setConnection(conn);
            } catch (err) {
                console.error('Connection failed: ', err);
            }
        };

        connect();

        return () => {
            connection?.stop();
        };
    }, [cardId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() || (fileUploadRef.current?.getFiles()?.length ?? 0) > 0) {
            const files = fileUploadRef.current?.getFiles() || [];
            const attachments = files.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
                size: file.size,
            }));

            const messagePayload = {
                taskId: cardId.cardId,
                text: newMessage,
            };

            try {
                const token = localStorage.getItem('token');
                await axios.post(`${apiUrl}/api/tasks/${cardId.cardId}/comments`, messagePayload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Замените на ваш токен
                    },
                });

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        text: newMessage,
                        sender: {
                            id: '1',
                            name: 'housesaroma', // Для реальных пользователей замените на актуальные данные
                        },
                        timestamp: new Date(),
                        attachments: attachments.length > 0 ? attachments : undefined,
                    },
                ]);
                setNewMessage('');
                fileUploadRef.current?.clear();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messageList}>
                {messages.map((message) => (
                    <div key={message.id} className={styles.messageItem}>
                        <div className={styles.messageHeader}>
                            <img src={icon} alt={message.sender} className={styles.avatar} />
                            <span className={styles.senderName}>{message.sender}</span>
                        </div>
                        {message.text && <div className={styles.messageText}>{message.text}</div>}
                        {message.attachments && (
                            <div className={styles.attachments}>
                                {message.attachments.map((file, index) => (
                                    <div key={index} className={styles.attachment}>
                                        <i className="pi pi-file" />
                                        <a href={file.url} download={file.name}>
                                            {file.name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <Button
                    icon="pi pi-paperclip"
                    className={styles.attachButton}
                    onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files && files.length > 0) {
                                const attachments = Array.from(files).map((file) => ({
                                    name: file.name,
                                    url: URL.createObjectURL(file),
                                    size: file.size,
                                }));

                                const message = {
                                    id: Date.now().toString(),
                                    text: newMessage,
                                    sender: { id: '1', name: 'housesaroma' },
                                    timestamp: new Date(),
                                    attachments,
                                };

                                setMessages((prev) => [...prev, message]);
                                setNewMessage('');
                            }
                        };
                        fileInput.click();
                    }}
                />
                <InputText
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение"
                    className={styles.messageInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <Button icon="pi pi-send" onClick={handleSendMessage} className={styles.sendButton} />
            </div>
        </div>
    );
};
