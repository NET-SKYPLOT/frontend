const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2 text-lg">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-4 text-blue-500 hover:underline">Go Back Home</a>
    </div>
);

export default NotFound;
