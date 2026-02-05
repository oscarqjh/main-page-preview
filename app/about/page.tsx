import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
	title: "About - LMMs-Lab",
	description: "About LMMs-Lab research team and projects",
};

interface Project {
	name: string;
	authors: string;
}

interface BoardMember {
	name: string;
	href: string;
	affiliation: string;
}

const board: BoardMember[] = [
	{ name: "Bo Li", href: "https://brianboli.com/", affiliation: "Nanyang Technological University" },
	{ name: "Ziwei Liu", href: "https://liuziwei7.github.io/", affiliation: "Nanyang Technological University" },
];

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
			<div className={styles.contentWrapper}>

				{/* ── Intro ── */}
				<section>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionLabel}>About</span>
						<div className={styles.sectionLine} />
					</div>
					<p className={styles.missionQuote}>
						&ldquo;Language learned all the rhetoric of &lsquo;blue&rsquo;, yet it has never seen the sky. True understanding begins where symbols end - in light, in motion, in the tremor of air as a bird crosses the horizon.&rdquo;
					</p>
				</section>

				{/* ── Scientific Board ── */}
				<section>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionLabel}>Scientific Board</span>
						<div className={styles.sectionLine} />
					</div>
					<div className={styles.boardGrid}>
						{board.map((member, i) => (
							<div key={member.name} className={styles.boardCard}>
								<span className={styles.boardIndex}>{String(i + 1).padStart(2, "0")}</span>
								<div>
									<Link
										href={member.href}
										target="_blank"
										className={styles.boardName}
									>
										{member.name}
									</Link>
									<p className={styles.boardAffiliation}>{member.affiliation}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* ── Core Projects ── */}
				<section>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionLabel}>Core Projects</span>
						<div className={styles.sectionLine} />
					</div>
					<div className={styles.projectsGrid}>
						{projects.map((project, index) => (
							<div key={project.name} className={styles.projectCard}>
								<div className={styles.projectHeader}>
									<span className={styles.projectIndex}>{String(index + 1).padStart(2, "0")}</span>
									<h3 className={styles.projectTitle}>{project.name}</h3>
								</div>
								<p className={styles.projectAuthors}>{project.authors}</p>
							</div>
						))}
					</div>
				</section>

			</div>
		</main>
	);
}
