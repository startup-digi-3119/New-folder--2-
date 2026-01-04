export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
}

export interface WorkoutDay {
    day: number;
    title: string;
    focus: string;
    exercises: Exercise[];
    abs: Exercise[];
    hiit?: string;
}

export interface WeeklyPlan {
    id: string; // e.g., 'week-1-2'
    title: string;
    description: string;
    weeks: number[]; // [1, 2]
    schedule: WorkoutDay[];
}

export const WORKOUT_PLAN: WeeklyPlan[] = [
    {
        id: 'week-1-2',
        title: 'Weeks 1–2: Build Form',
        description: 'Light Focus. Choose weights so last 2 reps are hard but form stays perfect.',
        weeks: [1, 2],
        schedule: [
            {
                day: 1,
                title: 'Push Day',
                focus: 'Chest, Shoulders, Triceps',
                exercises: [
                    { name: 'Floor Press', sets: 3, reps: '10–12' },
                    { name: 'Shoulder Press', sets: 3, reps: '10–12' },
                    { name: 'Chest Fly', sets: 3, reps: '12–15' },
                    { name: 'Triceps Extension', sets: 3, reps: '12' },
                    { name: 'Lateral Raise', sets: 3, reps: '12–15' }
                ],
                abs: [{ name: 'Plank', sets: 3, reps: '20–30s' }]
            },
            {
                day: 2,
                title: 'Pull Day',
                focus: 'Back, Biceps',
                exercises: [
                    { name: 'Bent Over Row', sets: 3, reps: '10–12' },
                    { name: '1-Arm Row', sets: 3, reps: '10–12/side' },
                    { name: 'Barbell Curl', sets: 3, reps: '10–12' },
                    { name: 'Reverse Fly', sets: 3, reps: '12–15' },
                    { name: 'Hand Gripper', sets: 3, reps: '20' }
                ],
                abs: [{ name: 'Russian Twists', sets: 3, reps: '15 total' }]
            },
            {
                day: 3,
                title: 'Legs Day',
                focus: 'Quads, Calves',
                exercises: [
                    { name: 'Goblet Squat', sets: 3, reps: '12–15' },
                    { name: 'Lunges', sets: 3, reps: '10/leg' },
                    { name: 'Calf Raise', sets: 3, reps: '15–20' }
                ],
                abs: [{ name: 'Crunches', sets: 3, reps: '15' }]

            },
            {
                day: 4,
                title: 'Push Day 2',
                focus: 'Chest, Shoulders, Triceps',
                exercises: [
                    { name: 'Incline Push-up', sets: 3, reps: '10–15' },
                    { name: 'Arnold Press', sets: 3, reps: '12' },
                    { name: 'Close Grip Press', sets: 3, reps: '12–15' },
                    { name: 'Skull Crushers', sets: 3, reps: '12/side' },
                    { name: 'Front Raise', sets: 3, reps: '12–15' }
                ],
                abs: [{ name: 'Bicycle Crunches', sets: 3, reps: '15 total' }]
            },
            {
                day: 5,
                title: 'Pull Day 2',
                focus: 'Deadlift, Back',
                exercises: [
                    { name: 'Deadlift', sets: 3, reps: '10', notes: 'Focus on form' },
                    { name: 'Dumbbell Pullover', sets: 3, reps: '12–15' },
                    { name: 'Hammer Curl', sets: 3, reps: '12' },
                    { name: 'Shrugs', sets: 3, reps: '15' }
                ],
                abs: [{ name: 'Side Plank', sets: 3, reps: '20s/side' }]
            },
            {
                day: 6,
                title: 'Legs + HIIT',
                focus: 'Hamstrings, Cardio',
                exercises: [
                    { name: 'Romanian Deadlift', sets: 3, reps: '12' },
                    { name: 'Split Squat', sets: 3, reps: '10/leg' },
                    { name: 'Calf Raise', sets: 3, reps: '15' }
                ],
                abs: [{ name: 'Leg Raise', sets: 3, reps: '10' }],
                hiit: '6 rounds skipping: 20s ON / 40s OFF'
            },
            {
                day: 7,
                title: 'Rest Day',
                focus: 'Recovery',
                exercises: [],
                abs: []
            }
        ]
    },
    {
        id: 'week-3-4',
        title: 'Weeks 3–4: Build Volume',
        description: 'Increase reps by 2 or add 2kg where easy.',
        weeks: [3, 4],
        schedule: [
            {
                day: 1,
                title: 'Push Day',
                focus: 'Volume',
                exercises: [
                    { name: 'Floor Press', sets: 4, reps: '10–14' },
                    { name: 'Shoulder Press', sets: 4, reps: '10–14' },
                    { name: 'Chest Fly', sets: 3, reps: '14–16' },
                    { name: 'Triceps Extension', sets: 3, reps: '14' },
                    { name: 'Lateral Raise', sets: 3, reps: '14–16' }
                ],
                abs: [{ name: 'Plank', sets: 3, reps: '30–40s' }]
            },
            {
                day: 2,
                title: 'Pull Day',
                focus: 'Volume',
                exercises: [
                    { name: 'Bent Over Row', sets: 4, reps: '10–14' },
                    { name: '1-Arm Row', sets: 4, reps: '10–14/side' },
                    { name: 'Barbell Curl', sets: 4, reps: '10–14' },
                    { name: 'Reverse Fly', sets: 3, reps: '14–16' },
                    { name: 'Hand Gripper', sets: 3, reps: '25' }
                ],
                abs: [{ name: 'Russian Twists', sets: 3, reps: '20 total' }]
            },
            {
                day: 3,
                title: 'Legs Day',
                focus: 'Volume',
                exercises: [
                    { name: 'Goblet Squat', sets: 4, reps: '12–16' },
                    { name: 'Lunges', sets: 4, reps: '12/leg' },
                    { name: 'Calf Raise', sets: 4, reps: '16–22' }
                ],
                abs: [{ name: 'Crunches', sets: 3, reps: '20' }]
            },
            {
                day: 4,
                title: 'Push Day 2',
                focus: 'Volume',
                exercises: [
                    { name: 'Incline Push-up', sets: 4, reps: '12–16' },
                    { name: 'Arnold Press', sets: 4, reps: '12–14' },
                    { name: 'Close Grip Press', sets: 4, reps: '12–16' },
                    { name: 'Skull Crushers', sets: 3, reps: '14/side' },
                    { name: 'Front Raise', sets: 3, reps: '14–16' }
                ],
                abs: [{ name: 'Bicycle Crunches', sets: 3, reps: '20 total' }]
            },
            {
                day: 5,
                title: 'Pull Day 2',
                focus: 'Volume',
                exercises: [
                    { name: 'Deadlift', sets: 4, reps: '10–12' },
                    { name: 'Dumbbell Pullover', sets: 4, reps: '12–16' },
                    { name: 'Hammer Curl', sets: 4, reps: '12–14' },
                    { name: 'Shrugs', sets: 4, reps: '15–20' }
                ],
                abs: [{ name: 'Side Plank', sets: 3, reps: '30s/side' }]
            },
            {
                day: 6,
                title: 'Legs + HIIT',
                focus: 'Volume + Cardio',
                exercises: [
                    { name: 'Romanian Deadlift', sets: 4, reps: '12–14' },
                    { name: 'Split Squat', sets: 4, reps: '12/leg' },
                    { name: 'Calf Raise', sets: 4, reps: '16' }
                ],
                abs: [{ name: 'Leg Raise', sets: 3, reps: '12' }],
                hiit: '8 rounds skipping: 25s ON / 35s OFF'
            },
            { day: 7, title: 'Rest Day', focus: 'Recovery', exercises: [], abs: [] }
        ]
    },
    // Weeks 5-6 and 7-8 follow similar patterns with increased intensity
    {
        id: 'week-5-6',
        title: 'Weeks 5–6: Increase Load',
        description: 'Strength Phase. Add 2–4kg or reps. Rest 60–75s.',
        weeks: [5, 6],
        schedule: [
            {
                day: 1, title: 'Push Day', focus: 'Strength', exercises: [
                    { name: 'Floor Press', sets: 4, reps: '8–12 (+wt)' },
                    { name: 'Shoulder Press', sets: 4, reps: '8–12' },
                    { name: 'Chest Fly', sets: 4, reps: '12–15' },
                    { name: 'Triceps Extension', sets: 4, reps: '12–15' },
                    { name: 'Lateral Raise', sets: 4, reps: '12–15' }
                ], abs: [{ name: 'Plank', sets: 3, reps: '40–50s' }]
            },
            {
                day: 2, title: 'Pull Day', focus: 'Strength', exercises: [
                    { name: 'Bent Row', sets: 4, reps: '8–12' },
                    { name: '1-Arm Row', sets: 4, reps: '8–12/side' },
                    { name: 'Barbell Curl', sets: 4, reps: '8–12' },
                    { name: 'Reverse Fly', sets: 4, reps: '12–15' },
                    { name: 'Hand Gripper', sets: 4, reps: '25–30' }
                ], abs: [{ name: 'Russian Twists', sets: 4, reps: '20 total' }]
            },
            {
                day: 3, title: 'Legs Day', focus: 'Strength', exercises: [
                    { name: 'Goblet Squat', sets: 4, reps: '10–14 (+wt)' },
                    { name: 'Lunges', sets: 4, reps: '10–14/leg' },
                    { name: 'Calf Raise', sets: 4, reps: '20+' }
                ], abs: [{ name: 'Crunches', sets: 4, reps: '20–25' }]
            },
            {
                day: 4, title: 'Push Day 2', focus: 'Strength', exercises: [
                    { name: 'Incline Push-up', sets: 4, reps: '10–15' },
                    { name: 'Arnold Press', sets: 4, reps: '10–12' },
                    { name: 'Close Grip Press', sets: 4, reps: '10–14' },
                    { name: 'Skull Crushers', sets: 4, reps: '12/side' },
                    { name: 'Front Raise', sets: 4, reps: '12–15' }
                ], abs: [{ name: 'Bicycle Crunches', sets: 4, reps: '25 total' }]
            },
            {
                day: 5, title: 'Pull Day 2', focus: 'Strength', exercises: [
                    { name: 'Deadlift', sets: 4, reps: '8–10 (+wt)' },
                    { name: 'Dumbbell Pullover', sets: 4, reps: '10–14' },
                    { name: 'Hammer Curl', sets: 4, reps: '10–12' },
                    { name: 'Shrugs', sets: 4, reps: '20' }
                ], abs: [{ name: 'Side Plank', sets: 3, reps: '40s/side' }]
            },
            {
                day: 6, title: 'Legs + HIIT', focus: 'Strength + Cardio', exercises: [
                    { name: 'Romanian Deadlift', sets: 4, reps: '10–12' },
                    { name: 'Split Squat', sets: 4, reps: '10–12/leg' },
                    { name: 'Calf Raise', sets: 4, reps: '20' }
                ], abs: [{ name: 'Leg Raise', sets: 4, reps: '15' }], hiit: '10 rounds skipping: 30s ON / 30s OFF'
            },
            { day: 7, title: 'Rest Day', focus: 'Recovery', exercises: [], abs: [] }
        ]
    },
    {
        id: 'week-7-8',
        title: 'Weeks 7–8: Peak Intensity',
        description: 'Transform Phase. Add 1 set or max effort.',
        weeks: [7, 8],
        schedule: [
            {
                day: 1, title: 'Push Day', focus: 'Peak', exercises: [
                    { name: 'Floor Press', sets: 5, reps: '8–12' },
                    { name: 'Shoulder Press', sets: 5, reps: '8–12' },
                    { name: 'Chest Fly', sets: 4, reps: '12–15' },
                    { name: 'Triceps Extension', sets: 4, reps: '10–14' },
                    { name: 'Lateral Raise', sets: 4, reps: '12–15' }
                ], abs: [{ name: 'Plank', sets: 4, reps: '45–60s' }]
            },
            {
                day: 2, title: 'Pull Day', focus: 'Peak', exercises: [
                    { name: 'Bent Row', sets: 5, reps: '8–12' },
                    { name: '1-Arm Row', sets: 5, reps: '8–12/side' },
                    { name: 'Barbell Curl', sets: 5, reps: '8–12' },
                    { name: 'Reverse Fly', sets: 4, reps: '12–15' },
                    { name: 'Hand Gripper', sets: 4, reps: '30+' }
                ], abs: [{ name: 'Russian Twists', sets: 4, reps: '25 total' }]
            },
            {
                day: 3, title: 'Legs Day', focus: 'Peak', exercises: [
                    { name: 'Goblet Squat', sets: 5, reps: '8–12 (+max)' },
                    { name: 'Lunges', sets: 5, reps: '10–12/leg' },
                    { name: 'Calf Raise', sets: 5, reps: '20–25' }
                ], abs: [{ name: 'Crunches', sets: 4, reps: '25' }]
            },
            {
                day: 4, title: 'Push Day 2', focus: 'Peak', exercises: [
                    { name: 'Incline Push-up', sets: 5, reps: '10–15' },
                    { name: 'Arnold Press', sets: 5, reps: '8–12' },
                    { name: 'Close Grip Press', sets: 5, reps: '10–14' },
                    { name: 'Skull Crushers', sets: 4, reps: '10–14/side' },
                    { name: 'Front Raise', sets: 4, reps: '12–15' }
                ], abs: [{ name: 'Bicycle Crunches', sets: 4, reps: '30 total' }]
            },
            {
                day: 5, title: 'Pull Day 2', focus: 'Peak', exercises: [
                    { name: 'Deadlift', sets: 5, reps: '8–10' },
                    { name: 'Dumbbell Pullover', sets: 5, reps: '10–14' },
                    { name: 'Hammer Curl', sets: 5, reps: '10–12' },
                    { name: 'Shrugs', sets: 5, reps: '20+' }
                ], abs: [{ name: 'Side Plank', sets: 4, reps: '45s/side' }]
            },
            {
                day: 6, title: 'Legs + HIIT', focus: 'Peak + Cardio', exercises: [
                    { name: 'Romanian Deadlift', sets: 5, reps: '8–12' },
                    { name: 'Split Squat', sets: 5, reps: '10/leg' },
                    { name: 'Calf Raise', sets: 5, reps: '25' }
                ], abs: [{ name: 'Leg Raise', sets: 4, reps: '20' }], hiit: '12 rounds skipping: 30s ON / 30s OFF + climbers'
            },
            { day: 7, title: 'Rest Day', focus: 'Recovery', exercises: [], abs: [] }
        ]
    }
];
