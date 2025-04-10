import Header from "../../components/Header/Header.tsx";
import Board from "../../components/Board/Board.tsx";

interface MyComponentProps {
}

const Main = ({}: MyComponentProps) => {
    return <div>
        <Header></Header>
        <Board></Board>
    </div>
};

export default Main;