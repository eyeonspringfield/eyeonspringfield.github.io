function typeTextWithParagraphs(
    container: HTMLElement,
    paragraphs: string[],
    speed: number,
    onComplete?: () => void
) {
    let paragraphIndex = 0;
    let charIndex = 0;

    let isTyping = true;
    const typeNextCharacter = () => {
        if (paragraphIndex >= paragraphs.length) {
            isTyping = false;
            if (onComplete) onComplete();
            return;
        }
        let currentParagraph = container.querySelector(`p:nth-child(${paragraphIndex + 1})`);
        if (!currentParagraph) {
            currentParagraph = document.createElement("p");
            container.appendChild(currentParagraph);
        }
        const text = paragraphs[paragraphIndex];
        currentParagraph.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex >= text.length) {
            paragraphIndex++;
            charIndex = 0;
        }
        setTimeout(typeNextCharacter, speed);
    };
    typeNextCharacter();
    return () => (isTyping = false);
}

document.addEventListener('DOMContentLoaded', () => {
    const top = document.getElementById('top') as HTMLParagraphElement;
    const general = document.getElementById('general-btn') as HTMLButtonElement;
    const skills = document.getElementById('skills-btn') as HTMLButtonElement;
    const personal = document.getElementById('personal-btn') as HTMLButtonElement;
    const additional = document.getElementById('additional-btn') as HTMLButtonElement;
    const container = document.getElementById("text") as HTMLDivElement;

    let stopTyping: (() => void) | null = null;

    const handleClick = (paragraphs: string[], topMessage: string) => {
        if (container && !stopTyping) {
            container.innerHTML = "";
            top.textContent = topMessage;
            stopTyping = typeTextWithParagraphs(container, paragraphs, 10, () => {
                stopTyping = null;
            });
        }
    };

    general.addEventListener("click", () => {
        const paragraphs = [
            "hello, i'm Mark. i'm a Computer Science student at the University of Szeged with a passion for software development.",
            "my journey into tech started at a young age, as i have always been fascinated by technology and the endless possibilities to create with it.",
            "in addition to my academic studies, i am always exploring new technologies and learning new programming languages."
        ];
        handleClick(paragraphs, "> displaying general info.");
    });

    skills.addEventListener("click", () => {
        const paragraphs = [
            "here are some of the skills i have acquired during the course of my studies:",
            "programming languages: C, C++, C#, Java, Python, JavaScript, TypeScript, R, HTML, CSS, SCSS",
            "databases: MySQL, PostgreSQL, SQLite, Firebase",
            "frameworks: Angular, Nodejs, Expressjs, ASP.NET, ADO.NET",
            "these are the technologies i feel i am the most proficient at, however i am constantly learning and improving upon my skillset."
        ];
        handleClick(paragraphs, "> displaying skills info.");
    });

    let today = new Date();
    let birth = new Date(2003, 7, 14);
    let age = today.getFullYear() - birth.getFullYear();

    if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDay())
    ) {
        age--;
    }

    personal.addEventListener("click", () => {
        const paragraphs = [
            "i am currently " + age + " years old, i live in Budapest, Hungary, and study in Szeged at the University of Szeged.",
            "in my free time i enjoy working on my personal coding projects, researching fields of tech i find interesting, and of course sometimes i enjoy playing video games.",
            "outside of technology some of my hobbies include video editing, mountain biking, and i love listening to and creating music.",
            "i am fluent in english and hungarian, and i speak german as well."
        ];
        handleClick(paragraphs, "> displaying personal info.");
    });

    additional.addEventListener("click", () => {
        const paragraphs = [
            "some additional info about me:",
            "i lead a team of 6 during one semester in creating the \"rfsocial\" project, a nodejs based social media web application, which can be found on my GitHub profile. this project was an incredible learning experience for me, and taught me the fundamentals of teamwork in a software development environment.",
            "i was selected as a winner for the Allianz Technology Tech Championship 2024, which is a great honor, and i am deeply thankful for the opportunity Allianz Technology has provided.",
            "i have worked and am currently working on multiple other projects, which can be viewed under the \"my projects\" tab or on my GitHub profile."
        ];
        handleClick(paragraphs, "> displaying additional info.");
    });
});
