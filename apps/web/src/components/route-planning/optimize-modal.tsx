"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { OptimizeParams } from "@/lib/api/resources";

interface Values {
  num_buses?: string;
  seats_per_bus?: string;
  shift?: string;
  arrival_deadline?: string;
  multi_shift?: boolean;
}

export function OptimizeModal({
  open,
  onClose,
  onRun,
  running,
}: {
  open: boolean;
  onClose: () => void;
  onRun: (params: OptimizeParams) => Promise<void>;
  running?: boolean;
}) {
  const t = useTranslations("routePlanning.settings");
  const { register, handleSubmit } = useForm<Values>();

  const submit = handleSubmit(async (v) => {
    await onRun({
      num_buses: v.num_buses ? Number(v.num_buses) : 6,
      seats_per_bus: v.seats_per_bus ? Number(v.seats_per_bus) : 25,
      shift: v.shift || "morning",
      multi_shift: !!v.multi_shift,
      arrival_deadline: v.arrival_deadline || null,
    });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t("title")}
      subtitle={t("subtitle")}
      footer={
        <Button variant="primary" type="submit" form="optimize-form" className="flex-1" disabled={running}>
          <Sparkles className="h-4 w-4" />
          {running ? t("running") : t("run")}
        </Button>
      }
    >
      <form id="optimize-form" onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("numBuses")} required>
            <Input type="number" placeholder="e.g., 10" defaultValue={6} {...register("num_buses")} />
          </FormField>
          <FormField label={t("seatsPerBus")} required>
            <Input type="number" placeholder="e.g., 25" defaultValue={25} {...register("seats_per_bus")} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("shift")}>
            <Select {...register("shift")} defaultValue="morning">
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </Select>
          </FormField>
          <FormField label={t("arrivalDeadline")}>
            <Input type="time" {...register("arrival_deadline")} />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 accent-[color:var(--color-brand-navy)]" {...register("multi_shift")} />
          {t("multiShift")}
        </label>
      </form>
    </Modal>
  );
}
