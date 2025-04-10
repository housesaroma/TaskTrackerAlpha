import '../../styles/typography.scss';
import styles from './Header.module.scss'
import {Avatar} from "primereact/avatar";
import icon from '../../assets/3.png'
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";

interface MyComponentProps {
}

const Header = ({}: MyComponentProps) => {
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

    return <header className={styles.header}>
        <div className={styles.left}>
            <p>Alfa<span style={{color: currentTheme === 'dark' ? '#787878' : '#ccc'}}>Chill</span></p>
        </div>
        <div className={styles.right}>
            <Avatar shape={"circle"} image={icon} size={"large"}></Avatar>
            <p className={styles.nickName}>Никнейм</p>
        </div>
    </header>;
};

export default Header;