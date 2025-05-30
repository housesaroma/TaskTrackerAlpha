import '../../styles/typography.scss';
import styles from './Header.module.scss';
import {Avatar} from "primereact/avatar";
import icon from '../../assets/3.png';
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";
import {OverlayPanel} from "primereact/overlaypanel";
import {useRef, useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {FileUpload} from "primereact/fileupload";
import {boardService} from "../../services/board.service.ts";
import {Toast} from "primereact/toast";
import {IBoard} from "../../types/types.ts";

const Header = () => {
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const op = useRef<OverlayPanel>(null);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("Никнейм");
    const [showNicknameDialog, setShowNicknameDialog] = useState(false);
    const [newNickname, setNewNickname] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(icon);
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);
    const [boards, setBoards] = useState<IBoard[]>([]);
    const { projectId, boardId } = useParams<{ projectId: string; boardId: string }>();
    const currentBoardId = boardId ? parseInt(boardId) : null;

    // Состояния для диалога создания доски
    const [showBoardDialog, setShowBoardDialog] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");

    useEffect(() => {
        if (projectId) {
            loadBoards(parseInt(projectId));
        }
    }, [projectId]);

    const loadBoards = async (projectId: number) => {
        try {
            const boardsData = await boardService.getBoardsByProjectId(projectId);
            setBoards(boardsData);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: error instanceof Error ? error.message : 'Не удалось загрузить доски',
                life: 3000
            });
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        op.current?.toggle(e);
    };

    const handleNicknameChange = () => {
        setNewNickname(nickname);
        setShowNicknameDialog(true);
        op.current?.hide();
    };

    const handleNicknameSave = () => {
        if (newNickname.trim()) {
            setNickname(newNickname.trim());
            setShowNicknameDialog(false);
        }
    };

    const handleAvatarClick = () => {
        setShowAvatarDialog(true);
        op.current?.hide();
    };

    const handleAvatarUpload = (event: any) => {
        const file = event.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                if (e.target?.result) {
                    setAvatarUrl(e.target.result as string);
                }
            };
            fileReader.readAsDataURL(file);
        }
        setShowAvatarDialog(false);
    };

    const openAddBoardDialog = () => {
        setNewBoardName(`Новая доска ${boards.length + 1}`);
        setShowBoardDialog(true);
    };

    const handleAddBoard = async () => {
        if (newBoardName.trim() && projectId) {
            try {
                const newBoard = await boardService.createBoard({
                    title: newBoardName.trim(),
                    projectId: parseInt(projectId)
                });

                setBoards([...boards, newBoard]);
                setShowBoardDialog(false);

                // Навигация на новую доску
                navigate(`/${projectId}/main/${newBoard.boardId}`);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Успех',
                    detail: 'Доска успешно создана',
                    life: 3000
                });
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: error instanceof Error ? error.message : 'Не удалось создать доску',
                    life: 3000
                });
            }
        }
    };

    const switchBoard = (boardId: number) => {
        if (projectId) {
            navigate(`/${projectId}/main/${boardId}`);
        }
    };

    return (
        <header className={styles.header}>
            <Toast ref={toast} />

            <div className={styles.left}>
                <p>Alfa<span style={{color: currentTheme === 'dark' ? '#787878' : '#ccc'}}>Chill</span></p>
            </div>

            <div className={styles.boards}>
                {boards.map((board) => (
                    <Button
                        key={board.boardId}
                        className={`${styles.boardButton} ${board.boardId === currentBoardId ? styles.activeBoard : ''}`}
                        onClick={() => switchBoard(board.boardId)}
                        label={board.title}
                    />
                ))}
                <Button
                    className={styles.addBoardButton}
                    icon="pi pi-plus"
                    onClick={openAddBoardDialog}
                    rounded
                />
            </div>

            {/* Диалог создания новой доски */}
            <Dialog
                header="Создать новую доску"
                visible={showBoardDialog}
                onHide={() => setShowBoardDialog(false)}
                modal
                className={styles.dialog}
            >
                <div className={styles.dialogContent}>
                    <InputText
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="Введите название доски"
                        autoFocus
                    />
                    <Button
                        label="Создать"
                        onClick={handleAddBoard}
                        disabled={!newBoardName.trim()}
                        className={styles.saveButton}
                    />
                </div>
            </Dialog>

            <div className={styles.right} onClick={handleProfileClick}>
                <Avatar shape={"circle"} image={avatarUrl} size={"large"}></Avatar>
                <p className={styles.nickName}>{nickname}</p>
                <i className={'pi pi-angle-down'}></i>
            </div>

            <OverlayPanel ref={op} className={styles.overlay}>
                <div className={styles.menuItem}>
                    <Button
                        label="Заменить фото"
                        icon="pi pi-image"
                        text
                        className={styles.menuButton}
                        style={{color: 'var(--text-color)'}}
                        onClick={handleAvatarClick}
                    />
                </div>
                <div className={styles.menuItem}>
                    <Button
                        label="Изменить никнейм"
                        icon="pi pi-user-edit"
                        text
                        className={styles.menuButton}
                        style={{color: 'var(--text-color)'}}
                        onClick={handleNicknameChange}
                    />
                </div>
                <div className={styles.menuItem}>
                    <Button
                        label="Выйти"
                        icon="pi pi-sign-out"
                        text
                        severity="danger"
                        className={styles.menuButton}
                        onClick={handleLogout}
                        style={{color: 'var(--text-color)'}}
                    />
                </div>
            </OverlayPanel>

            <Dialog
                header="Изменить никнейм"
                visible={showNicknameDialog}
                onHide={() => setShowNicknameDialog(false)}
                modal
                className={styles.dialog}
            >
                <div className={styles.dialogContent}>
                    <InputText
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        placeholder="Введите новый никнейм"
                    />
                    <Button
                        label="Сохранить"
                        onClick={handleNicknameSave}
                        disabled={!newNickname.trim()}
                    />
                </div>
            </Dialog>

            <Dialog
                header="Загрузить новое фото"
                visible={showAvatarDialog}
                onHide={() => setShowAvatarDialog(false)}
                modal
                className={styles.dialog}
            >
                <div className={styles.dialogContent}>
                    <FileUpload
                        mode="basic"
                        name="avatar"
                        accept="image/*"
                        maxFileSize={1000000}
                        customUpload
                        uploadHandler={handleAvatarUpload}
                        auto
                        chooseLabel="Выберите изображение"
                    />
                </div>
            </Dialog>
        </header>
    );
};

export default Header;