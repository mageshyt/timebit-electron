import type http from "node:http";
import { readBody, sendJson } from "../router";
import {
  getDefaultUserProfile,
  updateDefaultUserProfile,
  type UserProfileUpdateInput,
} from "../services/user.service";

const toString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const toNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const normalizeProfile = (profile: Awaited<ReturnType<typeof getDefaultUserProfile>>) => ({
  id: profile.id,
  name: profile.name,
  avatarUrl: profile.avatar ?? "",
  timezone: profile.timezone ?? "UTC",
  dailyGoalTasks: profile.dailyGoalTasks,
  dailyGoalHabits: profile.dailyGoalHabits,
  syncServerUrl: profile.syncServerUrl ?? "",
  wakeTime: profile.wakeTime ?? "",
  sleepTime: profile.sleepTime ?? "",
  wellnessStandupEnabled: profile.wellnessStandupEnabled,
  wellnessHydrationEnabled: profile.wellnessHydrationEnabled,
  wellnessEyeStrainEnabled: profile.wellnessEyeStrainEnabled,
});

export async function getProfileRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const profile = await getDefaultUserProfile();
  sendJson(res, 200, { data: normalizeProfile(profile) });
}

export async function updateProfileRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody<Record<string, unknown>>(req);
  const update: UserProfileUpdateInput = {};

  if ("name" in body) {
    const value = toString(body.name)?.trim() ?? "";
    if (!value) {
      sendJson(res, 400, { error: "name cannot be empty" });
      return;
    }
    update.name = value;
  }

  if ("avatarUrl" in body) {
    update.avatar = toString(body.avatarUrl) ?? "";
  }

  if ("timezone" in body) {
    update.timezone = toString(body.timezone) ?? "UTC"
  }

  if ("dailyGoalTasks" in body) {
    const value = toNumber(body.dailyGoalTasks);
    if (value !== undefined) update.dailyGoalTasks = Math.max(0, value);
  }

  if ("dailyGoalHabits" in body) {
    const value = toNumber(body.dailyGoalHabits);
    if (value !== undefined) update.dailyGoalHabits = Math.max(0, value);
  }

  if ("syncServerUrl" in body) {
    update.syncServerUrl = toString(body.syncServerUrl) ?? "";
  }

  if ("wakeTime" in body) {
    update.wakeTime = toString(body.wakeTime) ?? "";
  }

  if ("sleepTime" in body) {
    update.sleepTime = toString(body.sleepTime) ?? "";
  }

  if ("wellnessStandupEnabled" in body) {
    update.wellnessStandupEnabled = !!body.wellnessStandupEnabled;
  }

  if ("wellnessHydrationEnabled" in body) {
    update.wellnessHydrationEnabled = !!body.wellnessHydrationEnabled;
  }

  if ("wellnessEyeStrainEnabled" in body) {
    update.wellnessEyeStrainEnabled = !!body.wellnessEyeStrainEnabled;
  }

  const profile = await updateDefaultUserProfile(update);
  sendJson(res, 200, { data: normalizeProfile(profile) });
}
