import { useState, useRef } from 'react';
import styles from './Chat.module.scss';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import icon from '../../assets/3.png'

interface Message {
    id: string;
    text: string;
    sender: {
        id: string;
        name: string;
        avatar?: string;
    };
    timestamp: Date;
    attachments?: Array<{
        name: string;
        url: string;
        size?: number;
    }>;
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const fileUploadRef = useRef<FileUpload>(null);

    const handleSendMessage = () => {
        if (newMessage.trim() || (fileUploadRef.current?.getFiles()?.length ?? 0) > 0) {
            const files = fileUploadRef.current?.getFiles() || [];
            const attachments = files.map(file => ({
                name: file.name,
                url: URL.createObjectURL(file),
                size: file.size
            }));

            const message: Message = {
                id: Date.now().toString(),
                text: newMessage,
                sender: {
                    id: '1', 
                    name: 'housesaroma',
                },
                timestamp: new Date(),
                attachments: attachments.length > 0 ? attachments : undefined
            };

            setMessages(prev => [...prev, message]);
            setNewMessage('');
            fileUploadRef.current?.clear();
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messageList}>
                {messages.map((message) => (
                    <div key={message.id} className={styles.messageItem}>
                        <div className={styles.messageHeader}>
                            <img 
                                src={icon}
                                alt={message.sender.name}
                                className={styles.avatar}
                            />
                            <span className={styles.senderName}>{message.sender.name}</span>
                        </div>
                        {message.text && (
                            <div className={styles.messageText}>{message.text}</div>
                        )}
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
                                const attachments = Array.from(files).map(file => ({
                                    name: file.name,
                                    url: URL.createObjectURL(file),
                                    size: file.size
                                }));

                                const message: Message = {
                                    id: Date.now().toString(),
                                    text: newMessage,
                                    sender: {
                                        id: '1',
                                        name: 'Current User',
                                    },
                                    timestamp: new Date(),
                                    attachments
                                };

                                setMessages(prev => [...prev, message]);
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
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <Button
                    icon="pi pi-send"
                    onClick={handleSendMessage}
                    className={styles.sendButton}
                />
            </div>
        </div>
    );
}; 