import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.userProfile.findFirst({
    orderBy: { id: "asc" },
  });

  if (!existing) {
    await prisma.userProfile.create({
      data: {
        name: "Primary User",
        avatar: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        dailyGoalTasks: 6,
        dailyGoalHabits: 4,
        pomodoroWorkMins: 25,
        pomodoroBreakMins: 5,
        pomodoroLongBreakMins: 15,
        syncServerUrl: "http://magesh.local:5719",
        wakeTime: "07:00",
        sleepTime: "23:00",
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
