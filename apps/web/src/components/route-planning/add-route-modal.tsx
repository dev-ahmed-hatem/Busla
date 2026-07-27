"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useList } from "@/lib/api/hooks";
import type { Bus, Driver, Supervisor } from "@/lib/api/resources";

interface Values {
  code: string;
  name?: string;
  shift?: string;
  bus?: string;
  driver?: string;
  supervisor?: string;
}

export function AddRouteModal({
  open,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  submitting?: boolean;
}) {
  const t = useTranslations("routePlanning.add");
  const tSettings = useTranslations("routePlanning.settings");
  const { register, handleSubmit, reset } = useForm<Values>();

  const buses = useList<Bus>(["buses", "opts"], "/api/v1/buses/", { page_size: 200 });
  const drivers = useList<Driver>(["drivers", "opts"], "/api/v1/drivers/", { page_size: 200 });
  const supervisors = useList<Supervisor>(["supervisors", "opts"], "/api/v1/supervisors/", { page_size: 200 });

  const submit = handleSubmit(async (v) => {
    await onSubmit({
      code: v.code,
      name: v.name || v.code,
      shift: v.shift || "morning",
      bus: v.bus || null,
      driver: v.driver || null,
      supervisor: v.supervisor || null,
    });
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t("title")}
      subtitle={t("subtitle")}
      footer={
        <>
          <Button variant="outline" type="button" className="flex-1" onClick={onClose}>
            {tSettings("cancel")}
          </Button>
          <Button variant="primary" type="submit" form="add-route-form" className="flex-1" disabled={submitting}>
            <Plus className="h-4 w-4" />
            {t("save")}
          </Button>
        </>
      }
    >
      <form id="add-route-form" onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("routeId")} required>
            <Input placeholder="R-16" {...register("code", { required: true })} />
          </FormField>
          <FormField label={t("name")}>
            <Input placeholder="Al Narges Route" {...register("name")} />
          </FormField>
        </div>
        <FormField label={t("shift")}>
          <Select {...register("shift")} defaultValue="morning">
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </Select>
        </FormField>
        <FormField label={t("bus")}>
          <Select placeholder="Select Bus" {...register("bus")}>
            {(buses.data?.results ?? []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.bus_number}
              </option>
            ))}
          </Select>
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("driver")}>
            <Select placeholder="Select driver" {...register("driver")}>
              {(drivers.data?.results ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t("supervisor")}>
            <Select placeholder="Select supervisor" {...register("supervisor")}>
              {(supervisors.data?.results ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </form>
    </Modal>
  );
}
