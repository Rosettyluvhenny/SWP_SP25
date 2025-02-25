
export default function Profile() {
    //Data tạm
    const user = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "123-456-7890",
        avatar: "/assets/default-avatar.png",
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="flex items-center space-x-6">
                <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
                <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phone}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                    Edit Profile
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
}
