import { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.scss';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import icon from '../../assets/3.png';
import axios from 'axios';

interface Message {
    id: string;
    text: string;
    date?: string;
    authorId?: string;
    sender?: {
        id: string;
        name: string;
    };
    timestamp?: Date;
    attachments?: Array<{
        name: string;
        url: string;
        size: number;
    }>;
}

export const Chat = ({ cardId }: { cardId: string }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const fileUploadRef = useRef<FileUpload>(null);
    const apiUrl = 'http://localhost:5001';

    // Загрузка комментариев при монтировании и при изменении cardId
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/tasks/${cardId}/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Преобразуем полученные комментарии в формат сообщений
                const fetchedMessages = response.data.map((comment: any) => ({
                    id: comment.commentId,
                    text: comment.text,
                    date: comment.dateCreated,
                    authorId: comment.authorId,
                    sender: {
                        id: comment.authorId,
                        name: comment.authorName || 'Anonymous', // Замените на реальное имя автора, если доступно
                    },
                }));

                setMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();

        // Опционально: можно добавить интервал для периодического обновления
        const intervalId = setInterval(fetchComments, 5000); // Обновление каждые 5 секунд

        return () => clearInterval(intervalId);
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
                taskId: cardId,
                text: newMessage,
            };

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `${apiUrl}/api/tasks/${cardId}/comments`,
                    messagePayload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Добавляем новый комментарий в список сообщений
                const newComment = {
                    id: response.data.commentId, // Предполагаем, что сервер возвращает ID нового комментария
                    text: newMessage,
                    sender: {
                        id: response.data.authorId || '1',
                        name: 'housesaroma', // Замените на реальные данные пользователя
                    },
                    timestamp: new Date(),
                    attachments: attachments.length > 0 ? attachments : undefined,
                };

                setMessages((prev) => [...prev, newComment]);
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
                            <img src={icon} alt={message.sender?.name} className={styles.avatar} />
                            <span className={styles.senderName}>{message.sender?.name}</span>
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
                                fileUploadRef.current?.setFiles(Array.from(files));
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