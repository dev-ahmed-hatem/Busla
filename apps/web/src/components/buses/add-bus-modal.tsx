"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";

export function AddBusModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("buses");
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t("addModal.title")}
      subtitle={t("addModal.subtitle")}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" className="flex-1">
            <Plus className="h-4 w-4" />
            {t("addBus")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField label={t("addModal.fields.busId")} required>
          <Input placeholder="e.g., Bus 05" />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("addModal.fields.model")} required>
            <Input placeholder="e.g., Toyota Coaster 2024" />
          </FormField>
          <FormField label={t("addModal.fields.plate")} required>
            <Input dir="rtl" placeholder="e.g., 1234 ج ب أ" />
          </FormField>
        </div>
        <FormField label={t("addModal.fields.capacity")} required>
          <Input placeholder="e.g., 25 Students" />
        </FormField>
        <FormField label={t("addModal.fields.odometer")} required>
          <Input placeholder="e.g., 12,500 km" />
        </FormField>
      </div>
    </Modal>
  );
}
