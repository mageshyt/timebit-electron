import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ipc } from "@/ipc/manager";
import type { UserSettings } from "./types";
import { useSettingsStore } from "./settings.store";

export function useSettingsActions() {
  const queryClient = useQueryClient();
  const resetDraft = useSettingsStore((s) => s.resetDraft);

  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: () => ipc.client.settings.getSettings(),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<UserSettings>) =>
      ipc.client.settings.updateSettings(data),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["settings"], updatedData);
      resetDraft();
    },
  });

  return {
    settings: settingsQuery.data as UserSettings | undefined,
    isLoading: settingsQuery.isLoading,
    isSaving: updateSettingsMutation.isPending,
    updateSettings: updateSettingsMutation.mutateAsync,
  };
}
