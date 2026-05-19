import React from "react";
import useAuthStore from "../../store/useAuthStore";

const ViewProfile = () => {

    const user = useAuthStore((state) => state.user);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold">Student Profile</h1>

                <p className="text-tertiary">Personal Information</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">

                <div className="flex items-center gap-6 border-b pb-6">

                    <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-primary">{user?.firstName} {user?.lastName}</h2>

                        <p className="text-slate-500">Student ID: {user?.user_id}</p>

                        <p className="text-slate-500">{user?.email}</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">

                    <div className="border rounded-lg p-4">
                        <p className="text-slate-500 text-sm">First Name</p>
                        <p className="font-semibold text-lg">
                            {user?.firstName}
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <p className="text-slate-500 text-sm">Last Name</p>
                        <p className="font-semibold text-lg">
                            {user?.lastName}
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <p className="text-slate-500 text-sm">Student ID</p>
                        <p className="font-semibold text-lg">
                            {user?.user_id}
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <p className="text-slate-500 text-sm">Role</p>
                        <p className="font-semibold text-lg">
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;