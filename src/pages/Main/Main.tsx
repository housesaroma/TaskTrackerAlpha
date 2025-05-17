import { useParams } from 'react-router-dom';
import Board from "../../components/Board/Board.tsx";

const Main = () => {
    const { boardId } = useParams<{ boardId: string }>();

    return <div>
        <Board boardId={boardId || '1'} />
    </div>
};

export default Main;