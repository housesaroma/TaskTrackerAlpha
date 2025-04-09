import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import Test from "../components/test.tsx";

interface MyComponentProps {
}

const Main = ({}: MyComponentProps) => {
    return <div>
        <Header/>
        <Footer/>
        <Test/>
    </div>
};

export default Main;