"use client";

import Image from "next/image";
import { useEffect, useState, useActionState } from "react";
import {
    FiUser,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { setProfileIcon } from "@/actions/other-actions";

export default function ProfileIconModal({ userdata }) {
    const [isOpen, setIsOpen] = useState(false);

    const profileIcons = [
        "aanchal",
        "arya",
        "mehta",
        "tia",
        "kumar",
        "sharvil",
        "aashi",
        "dev",
        "vora",
        "bevin",
        "tushita",
        "ranveer",
        "khushi",
        "arhaan"
    ];

    const availableIcons = profileIcons.filter(
        (profileIcon) => profileIcon !== userdata.profile_icon
    );

    const [icon, setIcon] = useState(availableIcons[0]);

    const action = setProfileIcon.bind(null, userdata);

    const [formState, formAction, isPending] = useActionState(
        action,
        null
    );

    useEffect(() => {
        if (formState?.success) {
            toast.success("Profile icon updated successfully");
            setIsOpen(false);
        }

        if (formState?.errors?.length > 0) {
            formState.errors.forEach((error) => {
                toast.error(error);
            });
        }
    }, [formState]);

    const currentIndex = availableIcons.indexOf(icon);

    const changeIcon = (direction) => {
        if (availableIcons.length === 0) return;

        if (direction === "next") {
            const nextIndex =
                (currentIndex + 1) % availableIcons.length;

            setIcon(availableIcons[nextIndex]);
        } else {
            const previousIndex =
                (currentIndex - 1 + availableIcons.length) %
                availableIcons.length;

            setIcon(availableIcons[previousIndex]);
        }
    };

    const [touchStart, setTouchStart] = useState(null);

    const handleTouchStart = (e) => {
        if (isPending) return;

        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStart === null || isPending) return;

        const touchEnd = e.changedTouches[0].clientX;
        const difference = touchStart - touchEnd;

        if (Math.abs(difference) >= 50) {
            if (difference > 0) {
                changeIcon("next");
            } else {
                changeIcon("previous");
            }
        }

        setTouchStart(null);
    };

    return (
        <>
            <button
                onClick={() => {
                    setIcon(availableIcons[0]);
                    setIsOpen(true);
                }}
                className="text-xs px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-700 transition text-white flex items-center gap-2 font-medium tracking-wide"
                type="button"
            >
                <FiUser className="text-base" />
                Change Profile Icon
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
                        onClick={() =>
                            !isPending && setIsOpen(false)
                        }
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="w-full max-w-md p-4 rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[var(--theme-panel-b)] border border-purple-500/20 text-white">
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
                                    onClick={() =>
                                        !isPending &&
                                        setIsOpen(false)
                                    }
                                    className="text-[11px] font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                    disabled={isPending}
                                >
                                    Close
                                </button>
                            </div>

                            <div className="rounded-xl bg-white/[0.04] border border-purple-500/10 p-4 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] tracking-[0.08em] text-white/30">
                                        Selected icon
                                    </p>

                                    <p className="text-sm font-medium text-white text-center">
                                        {icon}
                                    </p>

                                    <div
                                        className="flex items-center justify-center gap-4 pt-1 touch-pan-y"
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeIcon("previous")
                                            }
                                            disabled={isPending}
                                            className="w-9 h-9 flex-shrink-0 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-500/45 hover:bg-purple-900/30 transition flex items-center justify-center text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                            aria-label="Previous profile icon"
                                        >
                                            <FiChevronLeft className="text-lg" />
                                        </button>

                                        <div className="flex justify-center">
                                            <Image
                                                src={`/profileicons/${icon}.png`}
                                                height={120}
                                                width={120}
                                                alt="profile icon"
                                                className="rounded-2xl border border-white/10 object-cover select-none"
                                                draggable={false}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeIcon("next")
                                            }
                                            disabled={isPending}
                                            className="w-9 h-9 flex-shrink-0 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-500/45 hover:bg-purple-900/30 transition flex items-center justify-center text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                            aria-label="Next profile icon"
                                        >
                                            <FiChevronRight className="text-lg" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-white/25 text-center pt-1">
                                        Swipe or use the arrows to choose
                                    </p>
                                </div>

                                <div className="border-t border-purple-500/10" />

                                <form action={formAction}>
                                    <input
                                        type="hidden"
                                        name="icon"
                                        value={icon}
                                        readOnly
                                    />

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 transition text-[13px] font-medium text-white tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "save changes"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}