"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";

interface Values {
  bus_number: string;
  model_name?: string;
  license_plate?: string;
  capacity?: string;
  odometer_km?: string;
}

export function AddBusModal({
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
  const t = useTranslations("buses");
  const { register, handleSubmit, reset } = useForm<Values>();

  const submit = handleSubmit(async (v) => {
    await onSubmit({
      bus_number: v.bus_number,
      model_name: v.model_name || "",
      license_plate: v.license_plate || "",
      capacity: v.capacity ? Number(v.capacity) : 25,
      odometer_km: v.odometer_km ? Number(v.odometer_km) : 0,
    });
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t("addModal.title")}
      subtitle={t("addModal.subtitle")}
      footer={
        <>
          <Button variant="outline" type="button" className="flex-1" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="submit" form="add-bus-form" className="flex-1" disabled={submitting}>
            <Plus className="h-4 w-4" />
            {t("addBus")}
          </Button>
        </>
      }
    >
      <form id="add-bus-form" onSubmit={submit} className="flex flex-col gap-4">
        <FormField label={t("addModal.fields.busId")} required>
          <Input placeholder="e.g., Bus 05" {...register("bus_number", { required: true })} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("addModal.fields.model")}>
            <Input placeholder="e.g., Toyota Coaster 2024" {...register("model_name")} />
          </FormField>
          <FormField label={t("addModal.fields.plate")}>
            <Input dir="rtl" placeholder="e.g., 1234 ج ب أ" {...register("license_plate")} />
          </FormField>
        </div>
        <FormField label={t("addModal.fields.capacity")}>
          <Input type="number" placeholder="e.g., 25" {...register("capacity")} />
        </FormField>
        <FormField label={t("addModal.fields.odometer")}>
          <Input type="number" placeholder="e.g., 12500" {...register("odometer_km")} />
        </FormField>
      </form>
    </Modal>
  );
}
