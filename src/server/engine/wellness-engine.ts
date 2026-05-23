import { getPrismaClient } from "../db";
import { broadcaster } from "../ws/broadcaster";

const STANDUP_INTERVAL_MINUTES = 60;
const HYDRATION_INTERVAL_MINUTES = 30;
const EYE_STRAIN_INTERVAL_MINUTES = 20;

const getUserWellnessSettings = async () => {
  try {
    const prisma = getPrismaClient();

    const user = await prisma.userProfile.findFirst({
      select: {
        wellnessEyeStrainEnabled: true,
        wellnessHydrationEnabled: true,
        wellnessStandupEnabled: true,
      },
    });

    return {
      eyeStrain: user?.wellnessEyeStrainEnabled ?? false,
      hydration: user?.wellnessHydrationEnabled ?? false,
      standup: user?.wellnessStandupEnabled ?? false,
    };
  } catch (error) {
    console.error("Error fetching wellness settings:", error);
    return {
      eyeStrain: false,
      hydration: false,
      standup: false,
    };
  }
};

const getLastWellnessLogs = async () => {
  const prisma = getPrismaClient();

  const [last_standup, last_hydration, last_eye_strain] = await Promise.all([
    prisma.wellnessLog.findFirst({
      where: { type: "standup" },
      orderBy: { loggedAt: "desc" },
    }),
    prisma.wellnessLog.findFirst({
      where: { type: "water_intake" },
      orderBy: { loggedAt: "desc" },
    }),
    prisma.wellnessLog.findFirst({
      where: { type: "eye_strain" },
      orderBy: { loggedAt: "desc" },
    }),
  ]);

  return {
    standup: last_standup,
    hydration: last_hydration,
    eyeStrain: last_eye_strain,
  };
};

export const emitWellnessUpdate = async () => {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60));

    const settings = await getUserWellnessSettings();
    const lastLogs = await getLastWellnessLogs();
    const now = new Date();

    // check if we need to emit standup notification
    if (settings.standup) {
      const minutesSinceLastStandup = lastLogs.standup
        ? (now.getTime() - lastLogs.standup.loggedAt.getTime()) / (1000 * 60)
        : null;

      if (
        minutesSinceLastStandup === null ||
        minutesSinceLastStandup >= STANDUP_INTERVAL_MINUTES
      ) {
        broadcaster.broadcast({
          type: "wellness:standup",
          payload: {},
        });
      }
    }

    // check if we need to emit hydration notification
    if (settings.hydration) {
      const minutesSinceLastHydration = lastLogs.hydration
        ? (now.getTime() - lastLogs.hydration.loggedAt.getTime()) / (1000 * 60)
        : null;

      if (
        minutesSinceLastHydration === null ||
        minutesSinceLastHydration >= HYDRATION_INTERVAL_MINUTES
      ) {
        broadcaster.broadcast({
          type: "wellness:hydration",
          payload: {},
        });
      }
    }

    // check if we need to emit eye strain notification
    if (settings.eyeStrain) {
      const minutesSinceLastEyeStrain = lastLogs.eyeStrain
        ? (now.getTime() - lastLogs.eyeStrain.loggedAt.getTime()) / (1000 * 60)
        : null;

      if (
        minutesSinceLastEyeStrain === null ||
        minutesSinceLastEyeStrain >= EYE_STRAIN_INTERVAL_MINUTES
      ) {
        broadcaster.broadcast({
          type: "wellness:eye_strain",
          payload: {},
        });
      }
    }
  }
};

