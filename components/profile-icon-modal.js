"use client";

import Image from "next/image";
import { useState, useActionState } from "react";
import { FiUser } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { setProfileIcon } from "@/actions/other-actions";

export default function ProfileIconModal({ userdata }) {
    const [isOpen, setIsOpen] = useState(false);
    const [icon, setIcon] = useState(userdata.profile_icon);

    const action = setProfileIcon.bind(null,userdata)
    const [formState,formAction] = useActionState(action,null)

    const profileIcons = [
        "monster1",
        "monster2",
        "monster3",
        "monster4",
        "monster5",
        "monster6",
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-700 transition text-white flex items-center gap-2 font-medium tracking-wide"
                type="button"
            >
                <FiUser className="text-base" />
                Change Profile Icon
            </button>

            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="w-full max-w-md p-4 rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#1e1228] border border-purple-500/20 text-white">

                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h2 className="text-[15px] font-medium text-purple-400 tracking-wide">
                                        Change profile icon
                                    </h2>
                                    <p className="text-[11px] text-white/35 mt-0.5 uppercase tracking-widest">
                                        Choose your profile icon
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-[11px] font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition mt-0.5"
                                >
                                    Close
                                </button>
                            </div>

                            {/* Body */}
                            <div className="rounded-xl bg-white/[0.04] border border-purple-500/10 p-4 space-y-4">

                                {/* Selected Icon Preview */}
                                <div className="space-y-1">
                                    <p className="text-[10px] tracking-[0.08em] text-white/30">
                                        Selected icon
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                        {icon}
                                    </p>

                                    <div className="flex justify-center pt-1">
                                        <Image
                                            src={`/profileicons/${icon}.jpg`}
                                            height={120}
                                            width={120}
                                            alt="profile icon"
                                            className="rounded-2xl border border-white/10 object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-purple-500/10" />

                                {/* Form */}
                                <form action={formAction}>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-purple-400 mb-1">
                                                Select new icon
                                            </label>
                                            <p className="text-[10px] uppercase tracking-[0.06em] text-white/25 mb-2">
                                                Available presets
                                            </p>

                                            {/* Custom Select Wrapper */}
                                            <div className="relative">
                                                <select
                                                    className="w-full appearance-none bg-black/30 border border-purple-500/20 hover:border-purple-500/45 focus:border-purple-500/70 rounded-xl px-3 py-2.5 pr-9 text-[13px] text-white outline-none transition cursor-pointer"
                                                    value={icon}
                                                    onChange={(e) => setIcon(e.target.value)}
                                                >
                                                    {profileIcons.map((profileIcon) => (
                                                        <option
                                                            key={profileIcon}
                                                            value={profileIcon}
                                                            className="bg-[#1a1a1a] text-white text-[13px]"
                                                        >
                                                            {profileIcon}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Chevron Icon */}
                                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/50 text-sm pointer-events-none" />
                                            </div>
                                        </div>
                                        <input type="hidden" name="icon" value={icon} readOnly/>

                                        <button
                                            type="submit"
                                            className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 transition text-[13px] font-medium text-white tracking-wide"
                                        >
                                            save changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </>
    );
}