const OpenSource = () => {
    return (
        <section className="mt-6 px-4 md:px-8 text-gray-700">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
                Open Source Contribution
            </h2>
            <p className="leading-relaxed text-lg sm:text-base text-center sm:text-left">
                <strong>NET-SKYPLOT</strong> is an open-source project, inviting developers, researchers,
                and tech enthusiasts to collaborate, improve, and expand the platform. We encourage community
                contributions to enhance its functionality and usability.
            </p>
            <p className="mt-4 leading-relaxed text-lg sm:text-base text-center sm:text-left">
                If you're interested in contributing, you can explore our repositories, submit feature requests,
                or work on existing issues. Every contribution helps in making this platform better for everyone!
            </p>
            <p className="mt-4 leading-relaxed text-lg sm:text-base text-center sm:text-left">
                You can find our open-source repositories and documentation on our GitHub page.
                Join the community and be part of something innovative!
            </p>

            {/* Call-To-Action Button for GitHub */}
            <div className="mt-6 text-center sm:text-left">
                <a
                    href="https://github.com/your-repository"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition"
                >
                    Explore on GitHub
                </a>
            </div>
        </section>
    );
};

export default OpenSource;
