import '../../styles/typography.css';
interface MyComponentProps {}

const Header = ({}: MyComponentProps) => {
  return <div style={{font: 'var(--text-16-medium)'}}>Хеадер header</div>;
};

export default Header;