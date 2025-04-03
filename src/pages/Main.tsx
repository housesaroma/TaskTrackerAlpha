import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";

interface MyComponentProps {
}

const Main = ({}: MyComponentProps) => {
    return <div>
        <Header/>
        <Footer/>
    </div>
};

export default Main;