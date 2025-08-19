export type PostureRule = {
    name: string;
    description: string;
    category: string;
    joints: {
        name: string;
        points: [string, string, string];
        min: number;
        max: number;
    }[];
};

export const postureTemplates: PostureRule[] = [
    // === Strength Training ===
    {
        name: "Squat",
        category: "Strength",
        description: "Lower body squat with knees bent properly and back aligned.",
        joints: [
            { name: "Knee Bend", points: ["hip", "knee", "ankle"], min: 70, max: 100 },
            { name: "Back Alignment", points: ["shoulder", "hip", "knee"], min: 160, max: 180 },
        ],
    },
    {
        name: "Deadlift",
        category: "Strength",
        description: "Keep back straight and hips properly aligned.",
        joints: [
            { name: "Back Alignment", points: ["shoulder", "hip", "knee"], min: 160, max: 180 },
            { name: "Hip Angle", points: ["hip", "knee", "ankle"], min: 160, max: 180 },
        ],
    },
    {
        name: "Bicep Curl",
        category: "Strength",
        description: "Bend the elbow properly while keeping upper arm stable.",
        joints: [
            { name: "Elbow Bend", points: ["shoulder", "elbow", "wrist"], min: 40, max: 120 },
        ],
    },
    {
        name: "Shoulder Press",
        category: "Strength",
        description: "Raise arms overhead with proper shoulder alignment.",
        joints: [
            { name: "Shoulder Angle", points: ["elbow", "shoulder", "hip"], min: 70, max: 120 },
        ],
    },
    {
        name: "Lunges",
        category: "Strength",
        description: "Knee bent properly and hips aligned during lunge.",
        joints: [
            { name: "Knee Bend", points: ["hip", "knee", "ankle"], min: 70, max: 110 },
            { name: "Back Alignment", points: ["shoulder", "hip", "knee"], min: 160, max: 180 },
        ],
    },

    // === Core Training ===
    {
        name: "Plank",
        category: "Core",
        description: "Keep your back and hips aligned and straight.",
        joints: [
            { name: "Back Alignment", points: ["shoulder", "hip", "ankle"], min: 160, max: 180 },
        ],
    },
    {
        name: "Push-Up",
        category: "Core",
        description: "Keep your body straight and elbows bent properly.",
        joints: [
            { name: "Elbow Bend", points: ["shoulder", "elbow", "wrist"], min: 70, max: 110 },
            { name: "Back Alignment", points: ["shoulder", "hip", "ankle"], min: 160, max: 180 },
        ],
    },
    {
        name: "Sit-Up",
        category: "Core",
        description: "Bend hips properly and keep back angle controlled.",
        joints: [
            { name: "Hip Bend", points: ["shoulder", "hip", "knee"], min: 70, max: 110 },
        ],
    },
    {
        name: "Leg Raises",
        category: "Core",
        description: "Keep legs straight and hips stable.",
        joints: [
            { name: "Hip Angle", points: ["hip", "knee", "ankle"], min: 160, max: 180 },
        ],
    },
    {
        name: "Mountain Climbers",
        category: "Core",
        description: "Knees and hips move dynamically but with proper alignment.",
        joints: [
            { name: "Knee Bend", points: ["hip", "knee", "ankle"], min: 50, max: 130 },
            { name: "Back Alignment", points: ["shoulder", "hip", "ankle"], min: 150, max: 180 },
        ],
    },

    // === Cardio Training ===
    {
        name: "Jumping Jack",
        category: "Cardio",
        description: "Full arm and leg extension during the jump.",
        joints: [
            { name: "Arm Opening", points: ["shoulder", "elbow", "wrist"], min: 160, max: 180 },
            { name: "Leg Opening", points: ["hip", "knee", "ankle"], min: 160, max: 180 },
        ],
    },

    // === Yoga Poses ===
    {
        name: "Tree Pose",
        category: "Yoga",
        description: "Keep one leg stable and body upright.",
        joints: [
            { name: "Back Alignment", points: ["shoulder", "hip", "ankle"], min: 170, max: 180 },
        ],
    },
    {
        name: "Warrior Pose",
        category: "Yoga",
        description: "Front knee bent and back leg straight with hips aligned.",
        joints: [
            { name: "Front Knee Bend", points: ["hip", "knee", "ankle"], min: 70, max: 110 },
            { name: "Back Leg Straight", points: ["hip", "knee", "ankle"], min: 160, max: 180 },
        ],
    },
    {
        name: "Side Plank",
        category: "Yoga",
        description: "Body aligned sideways with hips raised.",
        joints: [
            { name: "Side Body Alignment", points: ["shoulder", "hip", "ankle"], min: 160, max: 180 },
        ],
    },
];
