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
    {name: "Keyvan Abbasmajidi", image: "/assets/img/team-members/abbasmajidi.png"},
    {name: "Elahe Fallahi", image: "/assets/img/team-members/fallahi.png"},
    {name: "Saeed Amiri", image: "/assets/img/team-members/amiri.png"},
    {name: "Mohammadreza Taheri", image: "/assets/img/team-members/taheri.png"},
    {name: "Lena Kazemahvazi", image: "/assets/img/team-members/kazemahvazi.png"},
    {name: "Arezou Shadkam", image: "/assets/img/team-members/shadkam.png"},
];

const OurTeam = () => {
    return (
        <div className="mt-6 text-gray-700">
            {/* Supervisor & Tutors */}
            <div className="flex flex-wrap justify-center items-center gap-10 mb-8">
                {/* Supervisor */}
                <div className="flex flex-col items-center text-center">
                    <img
                        src={supervisor.image}
                        alt={supervisor.name}
                        className="w-32 h-32 object-cover rounded-full shadow-md"
                    />
                    <a href={supervisor.profile} target="_blank" rel="noopener noreferrer"
                       className="mt-4 text-lg font-semibold text-blue-600 hover:underline">
                        {supervisor.name}
                    </a>
                    <p className="text-gray-500 text-base">{supervisor.role}</p>
                </div>

                {/* Tutors */}
                {tutors.map((tutor) => (
                    <div key={tutor.name} className="flex flex-col items-center text-center">
                        <img
                            src={tutor.image}
                            alt={tutor.name}
                            className="w-32 h-32 object-cover rounded-full shadow-md"
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
                <h3 className="text-2xl font-semibold text-center mb-4">Team Members</h3>
                <div className="grid grid-cols-3 gap-6 justify-center">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="flex flex-col items-center text-center">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-36 h-36 object-cover rounded-full shadow-md"
                            />
                            <h4 className="mt-3 text-lg font-medium">{member.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurTeam;
