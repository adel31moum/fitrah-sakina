'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/lib/i18n';

export type UserRole = 'groom' | 'bride' | 'wali' | 'visitor';

export type PledgeState = {
  accepted: boolean;
  acceptedAt: string | null;
  oath1: boolean;
  oath2: boolean;
  oath3: boolean;
};

export type WaliStatus = 'none' | 'pending_assignment' | 'assigned' | 'verified';

export type BookCondition = {
  id: string;
  category: string;
  key: string;
  value: string;
  agreedBy: ('groom' | 'bride' | 'wali')[];
  locked: boolean;
  createdAt: string;
};

export type DialoguePrompt = {
  id: string;
  from: 'groom' | 'bride' | 'wali';
  promptKey: string;
  promptText: string;
  responseText?: string;
  respondedBy?: 'groom' | 'bride' | 'wali';
  timestamp: string;
  answered: boolean;
};

export type MahrSettings = {
  currency: string;
  amount: number;
  pppAdjusted: number;
  paymentType: 'immediate' | 'deferred' | 'split';
  waiverApplied: boolean;
};

export type TentSettings = {
  independentLiving: boolean;
  location: string;
  relocationCapability: boolean;
  hijrahIntention: boolean;
  hijrahTarget: string;
};

export type ChildrenSettings = {
  desiredCount: string;
  educationGoal: string;
  islamicSchooling: boolean;
  quranMemorisationGoal: string;
  parentingAlignment: number;
};

export type CovenantDossier = {
  generated: boolean;
  generatedAt: string | null;
  downloadToken: string | null;
  handoverInitiated: boolean;
};

export type FitrahState = {
  locale: Locale;
  pledge: PledgeState;
  role: UserRole;
  userId: string | null;
  sessionId: string;
  activeModule: string;
  waliStatus: WaliStatus;
  waliContact: string | null;
  waliOtpVerified: boolean;
  bookConditions: BookCondition[];
  dialoguePrompts: DialoguePrompt[];
  mahrSettings: MahrSettings;
  tentSettings: TentSettings;
  childrenSettings: ChildrenSettings;
  covenantDossier: CovenantDossier;
  interactionLocked: boolean; // true after mutual agreement
  onboardingDone: boolean;    // true after first-time role selection
  activeStoryId: string | null; // null = channel list view, string = detail view
  // Actions
  setLocale: (locale: Locale) => void;
  acceptPledge: (oath1: boolean, oath2: boolean, oath3: boolean) => void;
  setRole: (role: UserRole) => void;
  setActiveModule: (module: string) => void;
  setWaliStatus: (status: WaliStatus) => void;
  setWaliContact: (contact: string) => void;
  verifyWaliOtp: () => void;
  addBookCondition: (condition: Omit<BookCondition, 'id' | 'agreedBy' | 'locked' | 'createdAt'>) => void;
  updateBookCondition: (id: string, updates: Partial<BookCondition>) => void;
  lockBookCondition: (id: string) => void;
  agreeToCondition: (id: string, role: 'groom' | 'bride' | 'wali') => void;
  addDialoguePrompt: (prompt: Omit<DialoguePrompt, 'id' | 'timestamp' | 'answered'>) => void;
  answerDialoguePrompt: (id: string, response: string, respondedBy: 'groom' | 'bride' | 'wali') => void;
  updateMahr: (settings: Partial<MahrSettings>) => void;
  updateTent: (settings: Partial<TentSettings>) => void;
  updateChildren: (settings: Partial<ChildrenSettings>) => void;
  initiateCovenant: () => void;
  generateDossier: () => void;
  lockInteraction: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  openStory: (id: string) => void;
  closeStory: () => void;
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const defaultMahr: MahrSettings = {
  currency: 'USD',
  amount: 1000,
  pppAdjusted: 1000,
  paymentType: 'immediate',
  waiverApplied: false,
};

const defaultTent: TentSettings = {
  independentLiving: true,
  location: '',
  relocationCapability: false,
  hijrahIntention: false,
  hijrahTarget: '',
};

const defaultChildren: ChildrenSettings = {
  desiredCount: '2-4',
  educationGoal: 'Islamic + Academic',
  islamicSchooling: true,
  quranMemorisationGoal: '10 Juz',
  parentingAlignment: 80,
};

export const useFitrahStore = create<FitrahState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      pledge: {
        accepted: false,
        acceptedAt: null,
        oath1: false,
        oath2: false,
        oath3: false,
      },
      role: 'visitor',
      userId: null,
      sessionId: generateId(),
      activeModule: 'council',
      waliStatus: 'none',
      waliContact: null,
      waliOtpVerified: false,
      bookConditions: [],
      dialoguePrompts: [],
      mahrSettings: defaultMahr,
      tentSettings: defaultTent,
      childrenSettings: defaultChildren,
      covenantDossier: {
        generated: false,
        generatedAt: null,
        downloadToken: null,
        handoverInitiated: false,
      },
      interactionLocked: false,
      onboardingDone: false,
      activeStoryId: null,

      setLocale: (locale) => set({ locale }),
      acceptPledge: (oath1, oath2, oath3) =>
        set({
          pledge: {
            accepted: true,
            acceptedAt: new Date().toISOString(),
            oath1,
            oath2,
            oath3,
          },
        }),
      setRole: (role) => set({ role }),
      setActiveModule: (module) => set({ activeModule: module }),
      setWaliStatus: (status) => set({ waliStatus: status }),
      setWaliContact: (contact) => set({ waliContact: contact }),
      verifyWaliOtp: () => set({ waliOtpVerified: true }),
      addBookCondition: (condition) =>
        set((state) => ({
          bookConditions: [
            ...state.bookConditions,
            {
              ...condition,
              id: generateId(),
              agreedBy: [],
              locked: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateBookCondition: (id, updates) =>
        set((state) => ({
          bookConditions: state.bookConditions.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      lockBookCondition: (id) =>
        set((state) => ({
          bookConditions: state.bookConditions.map((c) =>
            c.id === id ? { ...c, locked: true } : c
          ),
        })),
      agreeToCondition: (id, role) =>
        set((state) => ({
          bookConditions: state.bookConditions.map((c) =>
            c.id === id && !c.agreedBy.includes(role)
              ? { ...c, agreedBy: [...c.agreedBy, role] }
              : c
          ),
        })),
      addDialoguePrompt: (prompt) =>
        set((state) => ({
          dialoguePrompts: [
            ...state.dialoguePrompts,
            {
              ...prompt,
              id: generateId(),
              timestamp: new Date().toISOString(),
              answered: false,
            },
          ],
        })),
      answerDialoguePrompt: (id, response, respondedBy) =>
        set((state) => ({
          dialoguePrompts: state.dialoguePrompts.map((p) =>
            p.id === id
              ? { ...p, responseText: response, respondedBy, answered: true }
              : p
          ),
        })),
      updateMahr: (settings) =>
        set((state) => ({ mahrSettings: { ...state.mahrSettings, ...settings } })),
      updateTent: (settings) =>
        set((state) => ({ tentSettings: { ...state.tentSettings, ...settings } })),
      updateChildren: (settings) =>
        set((state) => ({
          childrenSettings: { ...state.childrenSettings, ...settings },
        })),
      initiateCovenant: () =>
        set((state) => ({
          covenantDossier: { ...state.covenantDossier, handoverInitiated: true },
        })),
      generateDossier: () =>
        set((state) => ({
          covenantDossier: {
            ...state.covenantDossier,
            generated: true,
            generatedAt: new Date().toISOString(),
            downloadToken: generateId(),
          },
        })),
      lockInteraction: () => set({ interactionLocked: true }),
      completeOnboarding: () => set({ onboardingDone: true }),
      resetOnboarding: () => set({ onboardingDone: false }),
      openStory: (id) => set({ activeStoryId: id }),
      closeStory: () => set({ activeStoryId: null }),
    }),
    {
      name: 'fitrah-sakina-state',
      partialize: (state) => ({
        locale: state.locale,
        pledge: state.pledge,
        role: state.role,
        userId: state.userId,
        sessionId: state.sessionId,
        waliStatus: state.waliStatus,
        waliContact: state.waliContact,
        waliOtpVerified: state.waliOtpVerified,
        bookConditions: state.bookConditions,
        dialoguePrompts: state.dialoguePrompts,
        mahrSettings: state.mahrSettings,
        tentSettings: state.tentSettings,
        childrenSettings: state.childrenSettings,
        covenantDossier: state.covenantDossier,
        interactionLocked: state.interactionLocked,
        onboardingDone: state.onboardingDone,
      }),
    }
  )
);
