'use client';
import { FiUser } from "react-icons/fi";
import { useState, useRef, useEffect } from 'react';

export default function ProfileDropdown({ id }) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [userdata, setUserdata] = useState(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const modalWidth = 320;
            const viewportWidth = window.innerWidth;
            let left = rect.left;
            if (left + modalWidth > viewportWidth) left = viewportWidth - modalWidth - 16;
            setPosition({ top: rect.bottom + 12, left });

            // Fetch user data
            fetch('/api/getuserdata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) setUserdata(data.userdata);
                    else console.error('Failed to fetch user data');
                })
                .catch(err => console.error('Fetch error:', err));
        }
    }, [isOpen]);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 bg-[#170b22] border border-purple-500/40 hover:border-purple-400 text-white rounded-full transition"
                type="button"
            >
                <FiUser className="text-xl" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-opacity-20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="absolute z-50 bg-[#0d0b14] p-5 rounded-xl shadow-xl w-80 text-left"
                        style={{ top: position.top, left: position.left }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold">Profile</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition"
                            >
                                Close
                            </button>
                        </div>
                        <div className="">
                            {userdata ? (
                                <>
                                    <div className="bg-gray-500 text-white p-2 rounded mt-2">
                                        <p>Hello {userdata.username} </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="border border-white">
                                            <p>{userdata.firstname} {userdata.lastname}</p>
                                            <p>{userdata.email}</p>
                                        </div>
                                        <div className="border border-white">
                                            <p>No of subjects</p>
                                            <p>{JSON.parse(userdata.subjects).length}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
