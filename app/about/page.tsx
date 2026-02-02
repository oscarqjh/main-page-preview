import MotionLink from '@/components/motion/MotionLink';
import styles from './page.module.css';

export const metadata = {
	title: "About - LMMs-Lab",
	description: "About LMMs-Lab research team and projects",
};

interface Project {
	name: string;
	authors: string;
}

const projects: Project[] = [
	{ name: "Aero-1-Audio", authors: "Kaichen Zhang, Bo Li, Yezhen Wang" },
	{ name: "EgoLife", authors: "Jingkang Yang, Shuai Liu, Hongming Guo" },
	{ name: "LLaVA-Critic-R1", authors: "Xiyao Wang, Chunyuan Li" },
	{ name: "LLaVA-OneVision", authors: "Bo Li, Yuanhan Zhang, Dong Guo, Renrui Zhang, Feng Li, Hao Zhang, Kaichen Zhang, Peiyuan Zhang, Yanwei Li, Ziwei Liu, Chunyuan Li" },
	{ name: "LLaVA-OneVision-1.5", authors: "Xiang An, Yin Xie, Kaicheng Yang, Changrui Chen, Huajie Tan, Chunyuan Li, Zizhen Yan, *Ziyong Feng, *Ziwei Liu, *Bo Li, *Jiankang Deng" },
	{ name: "LMMs-Eval", authors: "Bo Li, Kaichen Zhang, Fanyi Pu, Peiyuan Zhang, Joshua Adrian Cahyono, Kairui Hu, Shuai Liu, Nguyen Quang Trung, Cong Pham, Devin Thang" },
	{ name: "LongVA", authors: "Peiyuan Zhang, Kaichen Zhang, Bo Li" },
	{ name: "LMMs-Engine", authors: "Kaichen Zhang, Bo Li" },
	{ name: "Multimodal-SAE", authors: "Kaichen Zhang, Bo Li, Yifei Shen" },
];

export default function AboutPage() {
	return (
		<main className={styles.container}>
			<div className={`${styles.contentWrapper} ${styles.animateIn}`}>
				
				<section>
					<h1 className={styles.title}>
						About Us
					</h1>
					<p className={styles.description}>
						LMMs-Lab is a non-profit research-oriented organization with a group of passionate researchers, we share the sincere passion for developing multimodal intelligence.
					</p>
				</section>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Scientific Board
					</h2>
					<div className={styles.scientificBoardGrid}>
						<div className={styles.card}>
							<MotionLink 
								href="https://brianboli.com/" 
								target="_blank"
								className={styles.cardName}
							>
								Bo Li
							</MotionLink>
							<p className={styles.cardAffiliation}>Nanyang Technological University</p>
						</div>
						<div className={styles.card}>
							<MotionLink 
								href="https://liuziwei7.github.io/" 
								target="_blank"
								className={styles.cardName}
							>
								Ziwei Liu
							</MotionLink>
							<p className={styles.cardAffiliation}>Nanyang Technological University</p>
						</div>
					</div>
				</section>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Members of Core Projects
					</h2>
					<div className={styles.projectsGrid}>
						{projects.map((project, index) => (
							<div 
								key={project.name}
								className={styles.projectCard}
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<h3 className={styles.projectTitle}>
									{project.name}
								</h3>
								<p className={styles.projectAuthors}>
									{project.authors}
								</p>
							</div>
						))}
					</div>
				</section>

			</div>
		</main>
	);
}
