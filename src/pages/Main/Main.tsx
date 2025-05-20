import { useParams } from 'react-router-dom';
import Board from "../../components/Board/Board.tsx";

const Main = () => {
    const { projectId, boardId } = useParams<{ projectId: string; boardId: string; }>();

    return <div>
        <Board boardId={boardId || '1'} projectId={projectId || '1'}/>
    </div>
};

export default Main;