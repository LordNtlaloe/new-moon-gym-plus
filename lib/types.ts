// types/meal.ts
export enum MealType {
    BREAKFAST = "Breakfast",
    LUNCH = "Lunch",
    DINNER = "Dinner"
}

export type UserRole = "member" | "Trainer" | "Admin";

export interface MealEntry {
    id: string;
    userId: string;
    date: string;
    mealType: MealType;
    imageUrl: string;
    notes?: string;
    createdAt: Date;
}

export interface MealDaySummary {
    [x: string]: any;
    date: string;
    breakfast?: MealEntry;
    lunch?: MealEntry;
    dinner?: MealEntry;
}

// lib/types/member.ts
export enum MemberStatus {
    ACTIVE = "active",
    BANNED = "banned",
    SUSPENDED = "suspended",
    INJURED = "injured",
    PENDING = "pending",
    INACTIVE = "inactive",
    TERMINATED = "terminated"
}

export enum MemberProgram {
    WEIGHT_LOSS = "weight-loss",
    MUSCLE_GAIN = "muscle-gain",
    GENERAL_FITNESS = "general-fitness",
    SPORTS_TRAINING = "sports-training",
    REHABILITATION = "rehabilitation",
    NUTRITION_COACHING = "nutrition-coaching"
}

export enum MembershipTier {
    BASIC = "basic",
    STANDARD = "standard",
    PREMIUM = "premium",
    VIP = "vip",
    ELITE = "elite"
}

// lib/types.ts
export interface Member {
    _id: string;
    userId?: string; 
    currentProgram: string;
    dateOfJoining: string;
    programDuration: string;
    status: 'active' | 'inactive' | 'suspended' | 'banned';
    createdAt: string;
    updatedAt: string;
    // Removed all User fields since we'll populate them when needed
}

export interface User {
    _id: string;
    clerkId: string;
    email: string;
    username?: string;
    firstName: string;
    lastName: string;
    photo?: string;
    role: string;
}

export type MemberWithUser = Member & { user: User };
// Type for creating a new member
export interface CreateMemberDto {
    clerkUserId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    status?: MemberStatus;
    membershipTier: MembershipTier;
    currentProgram: MemberProgram;
    programStartDate: Date;
    programEndDate?: Date;
    assignedTrainerId?: string;
}

// Type for updating member information
export interface UpdateMemberDto {
    status?: MemberStatus;
    membershipTier?: MembershipTier;
    currentProgram?: MemberProgram;
    programEndDate?: Date | null;
    assignedTrainerId?: string | null;
    injuries?: string[];
    medicalConditions?: string[];
    emergencyContact?: {
        name: string;
        relationship: string;
        phoneNumber: string;
    } | null;
    notes?: string;
}

// Type for member filters
export interface MemberFilters {
    status?: MemberStatus[];
    program?: MemberProgram[];
    membershipTier?: MembershipTier[];
    trainerId?: string;
    paymentStatus?: ("current" | "overdue" | "delinquent")[];
}