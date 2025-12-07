
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";


// External Placeholder Images for the Skeletons
const PLACEHOLDER_IMG_SPLIT = "https://placehold.co/800x800/2962FF/FFFFFF?text=Expense+Split+UI";
const PLACEHOLDER_IMG_PROMO = "https://placehold.co/800x800/E53935/FFFFFF?text=YouTube+Video+Promo";
const PLACEHOLDER_IMG_DASHBOARD = "https://placehold.co/800x600/4CAF50/FFFFFF?text=Live+Dashboard+View";

// --- Custom Components for replacing external libs ---

// Simple SVG for YouTube Icon

// Simple Globe SVG/CSS animation placehol


// --- Skeleton Components ---

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                    {/* TODO */}
                    <img
                        src="/batwara-split.png"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <a
            href="https://youtu.be/La4F7RDVMRw"
            target="__blank"
            className="relative flex gap-10  h-full group/image"
        >
            <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
                    {/* TODO */}
                    <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
                    <img
                        src="/batwara-promo.png"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
                    />
                </div>
            </div>
        </a>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
    };
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
            {/* TODO */}
            <div className="flex flex-row -ml-20">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
                    >
                        <img
                            src={image}
                            alt="bali images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
                        />
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-row">
                {images.map((image, idx) => (
                    <motion.div
                        key={"images-second" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        variants={imageVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
                    >
                        <img
                            src={image}
                            alt="bali images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
            <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
        </div>
    );
};


export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

export const SkeletonFive = () => {
    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xl w-full max-w-sm flex flex-col gap-4 border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 text-center">Optimized Settlement</p>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                    <span className="text-blue-500 font-semibold text-lg">Alex</span>
                    <span className="text-neutral-500 text-sm italic">Owes</span>
                    <span className="text-green-500 font-semibold text-lg">Priya</span>
                </div>
                <div className="mx-auto text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">₹22</div>
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-sky-400 rounded-full animate-pulse" />
            </div>
        </div>
    );
};

export const SkeletonSix = () => {
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full h-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <img
                    src="/batwara-product.png"
                    className="w-full h-full object-cover"
                    alt="dashboard"
                    
                />
            </div>
        </div>
    );
};

export const SkeletonSeven = () => {
    // Adjusted padding for tighter layouts
    return (
        <div className="flex flex-col items-center justify-center h-full relative p-4 lg:p-8">
            <div className="bg-gray-100 dark:bg-neutral-800 p-5 rounded-xl shadow-lg w-full text-center space-y-4">
                <p className="text-xl font-bold text-neutral-800 dark:text-white">Optimization</p>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="w-full h-2 bg-neutral-300 dark:bg-neutral-600 rounded-full overflow-hidden">
                        <div className="h-full bg-neutral-500 w-3/4"></div>
                    </div>
                    <span className="text-xs text-neutral-500">10 Transactions</span>
                </div>
                
                <div className="text-green-500">
                    <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                     <div className="w-full h-2 bg-neutral-300 dark:bg-neutral-600 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-1/4"></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">3 Transactions</span>
                </div>
            </div>
        </div>
    );
};

export const SkeletonEight = () => {
    return (
        // INCREASED BOTTOM PADDING HERE (pb-12)
        <div className="h-full pt-6 px-6 pb-12 flex items-center justify-center">
            <div className="border-l-4 border-indigo-500 pl-6 space-y-8 bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg shadow-inner w-full">

                {/* 1. Breakfast: Paid by Divyansh (Blue) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Breakfast at Saravana Bhavan
                    </p>
                    <p className="text-blue-400 text-xs">₹780 • Paid by Divyansh • Split equally</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-indigo-500 
                    border-2 border-white dark:border-black"></span>
                </div>

                {/* 2. Metro: Paid by Smriti (Purple) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Metro Recharge
                    </p>
                    <p className="text-purple-400 text-xs">₹200 • Paid by Smriti</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-indigo-500 
                    border-2 border-white dark:border-black"></span>
                </div>

                {/* 3. Snacks: Paid by Abhinav (Yellow) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Snacks at India Gate
                    </p>
                    <p className="text-yellow-400 text-xs">₹350 • Paid by Abhinav • Split by 3</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-indigo-500 
                    border-2 border-white dark:border-black"></span>
                </div>

                {/* 4. Cab: Paid by Arjun (Red) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Cab to Connaught Place
                    </p>
                    <p className="text-red-400 text-xs">₹220 • Paid by Arjun</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-indigo-500 
                    border-2 border-white dark:border-black"></span>
                </div>

                {/* 5. Dinner: Paid by Abhinav (Yellow) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Dinner at Farzi Café
                    </p>
                    <p className="text-yellow-400 text-xs">₹2,450 • Split equally • Paid by Abhinav</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-indigo-500 
                    border-2 border-white dark:border-black"></span>
                </div>

                {/* 6. Hotel: Paid by Abhinav (Yellow - based on assumption to calculate his net flow) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Hotel Room @ Paharganj
                    </p>
                    <p className="text-yellow-400 text-xs">₹3,200 • Paid by Abhinav • Split by stay duration</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-indigo-500 
                    border-2 border-white dark:border-black"></span>
                </div>

                {/* 7. Final Settlement (Abhinav's Status) */}
                <div className="relative">
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                        Final Settlement (Abhinav's Status)
                    </p>
                    <p className="text-emerald-500 text-xs font-bold">🎉 Abhinav gets back ₹4,275.83</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 
                    border-2 border-white dark:border-black animate-pulse"></span>
                </div>

            </div>
        </div>
    );
};

// NEW: Social Graph Skeleton (Improved)
import React from 'react';

// --- Types for the Social Graph ---
type DebtType = 'owe' | 'owed' | 'neutral';

interface NodeBase {
    name: string;
    x: number;
    y: number;
    color: string;
    radius: number;
}

interface FriendNode extends NodeBase {
    debtType: DebtType;
    amount: number;
}

interface UserNode extends NodeBase {}

export const SkeletonNine: React.FC = () => {
    // Defines common node coordinates
    const userPos: UserNode = { x: 100, y: 100, name: 'YOU', radius: 14, color: '#4F46E5' }; // Indigo

    const friendNodes: FriendNode[] = [
        { name: 'Alex', x: 50, y: 50, color: '#F87171', radius: 10, debtType: 'owe', amount: 1 }, // User owes Alex (small debt)
        { name: 'Jane', x: 150, y: 50, color: '#4ADE80', radius: 12, debtType: 'owed', amount: 2 }, // Jane owes User
        { name: 'Chris', x: 150, y: 150, color: '#EF4444', radius: 15, debtType: 'owe', amount: 3 }, // User owes Chris
        { name: 'Dave', x: 50, y: 150, color: '#9CA3AF', radius: 8, debtType: 'neutral', amount: 0 }, // Neutral/non-user flow (gray)
    ];

    // Calculates arrow line start/end point (offsetting from node center to avoid overlap with circle edge)
    const getLineCoords = (
        n1: NodeBase,
        n2: NodeBase,
        offset1?: number,
        offset2?: number
    ): { startX: number; startY: number; endX: number; endY: number } => {
        const o1 = offset1 ?? n1.radius;
        const o2 = offset2 ?? n2.radius;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1; // avoid div by zero

        const startX = n1.x + (dx * o1) / dist;
        const startY = n1.y + (dy * o1) / dist;

        const endX = n2.x - (dx * o2) / dist;
        const endY = n2.y - (dy * o2) / dist;

        return { startX, startY, endX, endY };
    };

    // Helper to draw a line between User and a Friend
    const renderUserEdge = (friend: FriendNode): React.ReactNode => {
        if (friend.debtType === 'neutral') return null;

        const isOwe = friend.debtType === 'owe';
        const startNode: NodeBase = isOwe ? userPos : friend;
        const endNode: NodeBase = isOwe ? friend : userPos;

        // Use a base line width and scale it based on the debt amount for visual impact
        const baseWidth = 1.5;
        const strokeWidth = baseWidth + (isOwe ? friend.amount * 0.75 : friend.amount * 0.5);

        const { startX, startY, endX, endY } = getLineCoords(startNode, endNode, startNode.radius, endNode.radius);

        const color = isOwe ? '#EF4444' : '#22C55E';
        const marker = isOwe ? 'url(#arrowRed)' : 'url(#arrowGreen)';
        const className = isOwe ? 'dark:stroke-red-500' : 'dark:stroke-green-500';

        return (
            <line
                key={`edge-${friend.name}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth={strokeWidth}
                markerEnd={marker}
                strokeLinecap="round"
                className={className + ' transition-all duration-300 ease-out'}
                opacity={0.85}
            />
        );
    };

    // Line for Dave -> Jane (non-user flow) - only compute if both nodes exist
    const daveNode = friendNodes.find((n) => n.name === 'Dave');
    const janeNode = friendNodes.find((n) => n.name === 'Jane');
    const daveJaneCoords = daveNode && janeNode ? getLineCoords(daveNode, janeNode, daveNode.radius, janeNode.radius) : null;

    return (
        <div className="h-full w-full flex items-center justify-center p-4 bg-transparent">
             <div className="relative w-full h-full max-h-[350px] bg-white dark:bg-gray-950 rounded-xl overflow-hidden border border-neutral-300 dark:border-gray-800 shadow-2xl">
                {/* SVG Graph Visualization */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                    <defs>
                        {/* Red Arrow: User is the Giver (Owes money) -> Arrow to Friend */}
                        <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L5,3 L0,6 L1.5,3 z" fill="#EF4444" />
                        </marker>
                        {/* Green Arrow: User is the Receiver (Is owed money) -> Arrow to User */}
                        <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L5,3 L0,6 L1.5,3 z" fill="#22C55E" />
                        </marker>
                        {/* Gray Arrow: Neutral/Other flow */}
                        <marker id="arrowGray" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L4,2 L0,4 L0.5,2 z" fill="#9CA3AF" />
                        </marker>
                    </defs>

                    {/* Connecting Edges (Debt/Owed) */}
                    
                    {/* Render User connections */}
                    {friendNodes.map(renderUserEdge)}

                    {/* Dave owes Jane (non-user flow) */}
                    {daveJaneCoords && (
                        <line
                            x1={daveJaneCoords.startX}
                            y1={daveJaneCoords.startY}
                            x2={daveJaneCoords.endX}
                            y2={daveJaneCoords.endY}
                            stroke="#9CA3AF"
                            strokeWidth={1}
                            markerEnd="url(#arrowGray)"
                            className="dark:stroke-neutral-700 opacity-60"
                            strokeDasharray="4, 2" // Dashed line for tertiary connection
                        />
                    )}
                    
                    {/* Nodes - Friend and User circles */}
                    
                    {/* Friend Nodes (Outside) */}
                    {friendNodes.map((node) => (
                        <React.Fragment key={node.name}>
                            <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={node.radius + 1} // Slightly larger for better visual
                                fill={node.color} // Use defined color for the fill
                                className="opacity-10 dark:opacity-20" // Light background color for contrast
                            />
                            <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={node.radius} 
                                fill="white" // Bright fill for the node core
                                className="dark:fill-neutral-900 shadow-md transition-all duration-500 ease-in-out" 
                                stroke={node.color} // Stronger color for the border
                                strokeWidth={node.debtType === 'owe' || node.debtType === 'owed' ? '2.5' : '1.5'} // Thicker border for important nodes
                            />
                            <text 
                                x={node.x} 
                                y={node.y + 1.5} 
                                fontSize="6.5" // Slightly smaller font for non-user nodes
                                textAnchor="middle" 
                                fill="#374151" 
                                fontWeight="600"
                                className="dark:fill-neutral-300"
                            >
                                {node.name}
                            </text>
                        </React.Fragment>
                    ))}

                    {/* Central Node (User) - Blue, Large, Animated */}
                    <circle cx={userPos.x} cy={userPos.y} r={userPos.radius + 4} fill="#6366F1" className="opacity-15" /> 
                    <circle cx={userPos.x} cy={userPos.y} r={userPos.radius} fill="#4F46E5" className="shadow-xl" />
                    <text x={userPos.x} y={userPos.y + 3} fontSize="8" textAnchor="middle" fill="#FFFFFF" fontWeight="bold" className="drop-shadow-sm">YOU</text>
                    
                    {/* Added: Pulse animation for the central node's outer ring */}
                    <circle cx={userPos.x} cy={userPos.y} r={userPos.radius + 2} fill="none" stroke="#4F46E5" strokeWidth="1" className="animate-ping" />
                </svg>
                
                {/* Legend/Title */}
                <div className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">💰 Social Debt Graph</h3>
                    <div className="mt-1 text-xs space-y-0.5">
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                            <span className="text-gray-600 dark:text-gray-400">You **Owe** (Payable)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                            <span className="text-gray-600 dark:text-gray-400">You are **Owed** (Receivable)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span>
                            <span className="text-gray-600 dark:text-gray-400">**YOU** (Central Node)</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};
export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                { location: [28.6139, 77.2090], size: 0.12 },  // Delhi
                { location: [19.0760, 72.8777], size: 0.10 },  // Mumbai
                { location: [23.1291, 113.2644], size: 0.11 }, // Guangzhou
                { location: [31.2304, 121.4737], size: 0.12 }, // Shanghai
                { location: [39.9042, 116.4074], size: 0.12 }, // Beijing
                { location: [35.6762, 139.6503], size: 0.10 }, // Tokyo
                { location: [40.7128, -74.0060], size: 0.10 }, // New York
                { location: [34.0522, -118.2437], size: 0.08 }, // Los Angeles
                { location: [51.5074, -0.1278], size: 0.07 },   // London
                { location: [48.8566, 2.3522], size: 0.06 },    // Paris
                { location: [55.7558, 37.6173], size: 0.08 },   // Moscow
                { location: [52.5200, 13.4050], size: 0.05 },   // Berlin
                { location: [41.0082, 28.9784], size: 0.07 },   // Istanbul
                { location: [30.0444, 31.2357], size: 0.08 },   // Cairo
                { location: [-23.5505, -46.6333], size: 0.10 }, // São Paulo
                { location: [-22.9068, -43.1729], size: 0.07 }, // Rio de Janeiro
                { location: [19.4326, -99.1332], size: 0.09 },  // Mexico City
                { location: [-34.6037, -58.3816], size: 0.07 }, // Buenos Aires
                { location: [6.5244, 3.3792], size: 0.09 },      // Lagos
                { location: [14.5995, 120.9842], size: 0.08 },  // Manila
                { location: [13.7563, 100.5018], size: 0.07 },  // Bangkok
                { location: [1.3521, 103.8198], size: 0.05 },    // Singapore
                { location: [3.1390, 101.6869], size: 0.06 },    // Kuala Lumpur
                { location: [-6.2088, 106.8456], size: 0.10 },  // Jakarta
                { location: [24.8607, 67.0011], size: 0.09 },   // Karachi
                { location: [31.5497, 74.3436], size: 0.08 },   // Lahore
                { location: [41.3851, 2.1734], size: 0.05 },     // Barcelona
                { location: [45.4642, 9.1900], size: 0.05 },     // Milan
                { location: [40.4168, -3.7038], size: 0.05 },    // Madrid
                { location: [32.0853, 34.7818], size: 0.04 },    // Tel Aviv
                { location: [21.0278, 105.8342], size: 0.07 },   // Hanoi
                { location: [10.8231, 106.6297], size: 0.08 },   // Ho Chi Minh City
                { location: [33.8688, 151.2093], size: 0.06 },   // Sydney
                { location: [-37.8136, 144.9631], size: 0.05 },  // Melbourne
                { location: [43.6532, -79.3832], size: 0.06 },   // Toronto
                { location: [45.5017, -73.5673], size: 0.05 },   // Montreal
                { location: [25.2048, 55.2708], size: 0.06 },    // Dubai
                { location: [26.2285, 50.5860], size: 0.04 },    // Manama
                { location: [33.5731, -7.5898], size: 0.05 },    // Casablanca
                { location: [4.7110, -74.0721], size: 0.07 },    // Bogotá
                { location: [9.0820, 8.6753], size: 0.05 },      // Abuja
                { location: [50.1109, 8.6821], size: 0.04 },     // Frankfurt
                { location: [59.9343, 30.3351], size: 0.06 },    // St. Petersburg
                { location: [60.1699, 24.9384], size: 0.03 },    // Helsinki
                { location: [-33.9249, 18.4241], size: 0.04 },   // Cape Town
                { location: [-1.2921, 36.8219], size: 0.06 },    // Nairobi
                { location: [-25.7479, 28.2293], size: 0.05 },   // Pretoria
                { location: [35.6895, 51.3890], size: 0.08 },    // Tehran
                { location: [34.6937, 135.5023], size: 0.07 },   // Osaka
                { location: [22.3964, 114.1095], size: 0.08 },   // Hong Kong
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.0025;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};
// --- Core Feature Components ---

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            <div className="absolute inset-0 bg-white dark:bg-black pointer-events-none opacity-5 dark:opacity-10"></div>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base  max-w-4xl text-left mx-auto",
                "text-neutral-500 font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export function FeaturesSection() {
    const features = [
        // Row 1
        {
            title: "Track issues effectively",
            description: "Track and manage your project issues with ease using our intuitive interface.",
            skeleton: <SkeletonOne />,
            className: "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800 bg-white dark:bg-black",
        },
        {
            title: "Capture pictures with AI",
            description: "Capture stunning photos effortlessly using our advanced AI technology.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800 bg-white dark:bg-black",
        },
        // Row 2
        {
            title: "Watch our AI on YouTube",
            description: "Whether its you or Tyler Durden, you can get to know about our product on YouTube",
            skeleton: <SkeletonThree />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-r dark:border-neutral-800 bg-white dark:bg-black",
        },
        {
            title: "Explore More, Worry Less",
            description: "Whether you’re traveling with friends or chilling at home, Batwara keeps every shared expense perfectly balanced in real time.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none dark:border-neutral-800 bg-white dark:bg-black",
        },
        // Row 3
        {
            title: "Settle Smarter, Not Harder",
            description: "Batwara computes the most efficient settlement path, reducing messy payment chains into clean, minimal transactions.",
            skeleton: <SkeletonFive />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-r dark:border-neutral-800 bg-white dark:bg-black",
        },
        {
            title: "Know Where You Stand, Instantly",
            description: "Your Dashboard updates live for every group—showing what you owe, what others owe you, and every upcoming settlement.",
            skeleton: <SkeletonSix />,
            className: "col-span-1 lg:col-span-3 border-b dark:border-neutral-800 bg-white dark:bg-black",
        },
        {
            title: "Fast Settlements",
            description: "Collapses debts so your group settles with the fewest payments.",
            skeleton: <SkeletonSeven />,
            className: "col-span-1 lg:col-span-2 lg:border-r dark:border-neutral-800 bg-white dark:bg-black",
        },
        {
            title: "Transparent Logging",
            description: "Batwara keeps a transparent timeline of all splits across your groups.",
            skeleton: <SkeletonEight />,
            className: "col-span-1 lg:col-span-2 lg:border-r dark:border-neutral-800 bg-white dark:bg-black",
        },
        // NEW FEATURE
        {
            title: "Social Graphs",
            description: "Visualize your financial connections and friend networks.",
            skeleton: <SkeletonNine />,
            className: "col-span-1 lg:col-span-2 dark:border-neutral-800 bg-white dark:bg-black",
        },
    ];

    return (
        <div className="relative z-20 py-10 lg:py-20 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black dark:text-white">
                    Packed with powerful features
                </h4>
                <p className="text-base lg:text-lg max-w-3xl my-4 mx-auto text-neutral-600 text-center font-normal dark:text-neutral-400">
                    Batwara simplifies group expenses with real-time tracking, AI-optimized settlements, and total transparency.
                </p>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className=" h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}