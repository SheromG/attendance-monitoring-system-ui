import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="bg-white rounded-xl p-10 text-center max-w-lg w-full">

                <h1 className="text-6xl font-bold text-primary mb-2">
                    404
                </h1>

                <h2 className="text-xl font-semibold text-slate-700 mb-2">
                    Page Not Found
                </h2>

                <p className="text-sm text-slate-500 mb-6">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                    >
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 rounded-md bg-primary text-white hover:bg-tertiary transition"
                    >
                        Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NotFound;