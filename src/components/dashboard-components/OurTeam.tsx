const supervisor = {
    name: "Prof. Fabio Dovis",
    role: "Supervisor",
    image: "/assets/img/team-members/dovis.png",
    profile: "https://www.polito.it/en/staff?p=fabio.dovis"
};

const tutors = [
    {
        name: "Prof. Marco Piras",
        role: "Tutor",
        image: "/assets/img/team-members/piras.png",
        profile: "https://www.polito.it/personale?p=marco.piras"
    },
    {
        name: "Prof. Vincenzo Di Pietra",
        role: "Tutor",
        image: "/assets/img/team-members/pietra.png",
        profile: "https://www.polito.it/personale?p=vincenzo.dipietra"
    },
];

const teamMembers = [
    {
        name: "Elahe Fallahi",
        image: "/assets/img/team-members/fallahi.png",
        linkdin: "https://www.linkedin.com/in/elahe-fallahi-005531158/"
    },
    {
        name: "Saeed Amiri",
        image: "/assets/img/team-members/amiri.png",
        linkdin: "https://www.linkedin.com/in/saeed-am/"
    },
    {
        name: "Reza Taheri",
        image: "/assets/img/team-members/taheri.png",
        linkdin: "https://www.linkedin.com/in/rezathriii/"
    },
    {
        name: "Lena Kazemahvazi",
        image: "/assets/img/team-members/kazemahvazi.png",
        linkdin: "https://www.linkedin.com/in/lenaahvazi/"
    },
    {
        name: "Arezou Shadkam",
        image: "/assets/img/team-members/shadkam.png",
        linkdin: "https://www.linkedin.com/in/contact-arezou-shadkam/"
    },
];

const OurTeam = () => {
    return (
        <section className="mt-6 px-4 md:px-8 text-gray-700">
            <div className="flex flex-wrap justify-center items-center gap-16 mb-8">
                {/* Supervisor */}
                <div className="flex flex-col items-center text-center w-40 sm:w-48">
                    <img
                        src={supervisor.image}
                        alt={supervisor.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full shadow-md"
                    />
                    <a href={supervisor.profile} target="_blank" rel="noopener noreferrer"
                       className="mt-4 text-lg font-semibold text-blue-600 hover:underline">
                        {supervisor.name}
                    </a>
                    <p className="text-gray-500 text-base">{supervisor.role}</p>
                </div>

                {/* Tutors */}
                {tutors.map((tutor) => (
                    <div key={tutor.name} className="flex flex-col items-center text-center w-40 sm:w-48">
                        <img
                            src={tutor.image}
                            alt={tutor.name}
                            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full shadow-md"
                        />
                        <a href={tutor.profile} target="_blank" rel="noopener noreferrer"
                           className="mt-4 text-lg font-semibold text-blue-600 hover:underline">
                            {tutor.name}
                        </a>
                        <p className="text-gray-500 text-base">{tutor.role}</p>
                    </div>
                ))}
            </div>

            {/* Team Members */}
            <div>
                <h3 className="text-2xl font-semibold text-center mb-6">Team Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center">
                    {teamMembers.map((member, index) => (
                        <div key={member.name}
                             className={`flex flex-col items-center text-center ${index >= 3 ? 'md:col-span-1' : ''}`}>
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-full shadow-md"
                            />
                            <a href={member.linkdin} target="_blank" rel="noopener noreferrer"
                               className="mt-4 text-lg font-semibold text-blue-600 hover:underline">
                                {member.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurTeam;
