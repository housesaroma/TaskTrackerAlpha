import styles from './matrix.module.scss'
import { ICard } from '../../types/types'
import BoardCard from '../BoardCard/BoardCard'

interface QuadrantProps {
	quadrantNumber: 1 | 2 | 3 | 4
	cards: ICard[]
}

const Quadrant: React.FC<QuadrantProps> = ({ quadrantNumber, cards }) => (
	<div className={`${styles.quadrant} ${styles[`quadrant-${quadrantNumber}`]}`}>
		<div className={styles['cards-container']}>
			{cards.map(card => (
				<BoardCard key={card.id} card={card} showMenu={false}/>
			))}
		</div>
	</div>
)

export default Quadrant
