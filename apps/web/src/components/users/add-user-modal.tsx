"use client";

import { ImagePlus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { PillTabs } from "@/components/ui/tabs";
import type { UserTab } from "@/lib/mock/users";

function PhotoUploader() {
  const t = useTranslations("users.addModal");
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">
        <ImagePlus className="h-6 w-6" />
        <span className="absolute -end-0.5 -bottom-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-navy text-white">
          <Plus className="h-3 w-3" />
        </span>
      </div>
      <div className="text-sm">
        <div className="font-medium text-slate-700">{t("uploadPhoto")}</div>
        <div className="text-xs text-slate-400">{t("photoHint")}</div>
      </div>
    </div>
  );
}

function StudentForm() {
  const t = useTranslations("users.addModal");
  const [tab, setTab] = useState("personal");
  return (
    <div>
      <PillTabs
        items={[
          { key: "personal", label: t("tabs.personal") },
          { key: "contact", label: t("tabs.contact") },
          { key: "address", label: t("tabs.address") },
        ]}
        value={tab}
        onValueChange={setTab}
        className="mb-5"
      />
      {tab === "personal" && (
        <div className="flex flex-col gap-4">
          <PhotoUploader />
          <FormField label={t("fields.fullName")} required>
            <Input placeholder="e.g., Ahmed Ali Hassan" />
          </FormField>
          <FormField label={t("fields.dob")} required>
            <Input type="date" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label={t("fields.grade")} required>
              <Select placeholder="Select Grade">
                <option>Primary 1</option>
                <option>Primary 2</option>
                <option>Primary 3</option>
              </Select>
            </FormField>
            <FormField label={t("fields.class")} required>
              <Select placeholder="Select Class">
                <option>3A</option>
                <option>3B</option>
              </Select>
            </FormField>
          </div>
        </div>
      )}
      {tab === "contact" && (
        <div className="flex flex-col gap-4">
          <FormField label={t("fields.guardianName")} required>
            <Input placeholder="e.g., Sara Mohamed Hussien" />
          </FormField>
          <FormField label={t("fields.phone")} required>
            <Input placeholder="e.g., 01123456789" />
          </FormField>
          <FormField label={t("fields.relationship")} required>
            <Select placeholder="Select (Mother / Father / Other)">
              <option>Mother</option>
              <option>Father</option>
              <option>Other</option>
            </Select>
          </FormField>
          <FormField label={t("fields.email")}>
            <Input type="email" placeholder="e.g., guardian@email.com" />
          </FormField>
        </div>
      )}
      {tab === "address" && (
        <div className="flex flex-col gap-4">
          <FormField label={t("fields.area")} required>
            <Select placeholder="Select Area (e.g., New Cairo)">
              <option>New Cairo</option>
              <option>Shorouk</option>
              <option>Madinaty</option>
            </Select>
          </FormField>
          <FormField label={t("fields.fullAddress")} required>
            <Textarea placeholder="Building number, Street name, District, Landmarks" />
          </FormField>
        </div>
      )}
    </div>
  );
}

function DriverForm() {
  const t = useTranslations("users.addModal");
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.personal")}</h3>
        <PhotoUploader />
        <FormField label={t("fields.fullName")} required>
          <Input placeholder="e.g., Samy Ahmed Ali" />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("fields.phone")} required>
            <Input placeholder="e.g., 01123456789" />
          </FormField>
          <FormField label={t("fields.nationalId")} required>
            <Input placeholder="e.g., 301xxxxxxxxxx" />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.work")}</h3>
        <FormField label={t("fields.license")} required>
          <Input placeholder="e.g., 123456789" />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("fields.licenseExpiry")} required>
            <Input type="date" />
          </FormField>
          <FormField label={t("fields.experience")} required>
            <Input placeholder="e.g., 5 years" />
          </FormField>
        </div>
      </section>
    </div>
  );
}

function SupervisorForm() {
  const t = useTranslations("users.addModal");
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.personal")}</h3>
        <PhotoUploader />
        <FormField label={t("fields.fullName")} required>
          <Input placeholder="e.g., Mona Mahmoud Ali" />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("fields.phone")} required>
            <Input placeholder="e.g., 01123456789" />
          </FormField>
          <FormField label={t("fields.nationalId")} required>
            <Input placeholder="e.g., 301xxxxxxxxxx" />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.home")}</h3>
        <FormField label={t("fields.area")} required>
          <Select placeholder="Select Area (e.g., New Cairo)">
            <option>New Cairo</option>
            <option>Shorouk</option>
            <option>Madinaty</option>
          </Select>
        </FormField>
        <FormField label={t("fields.fullAddress")} required>
          <Textarea placeholder="Building number, Street name, District, Landmarks" />
        </FormField>
      </section>
    </div>
  );
}

export function AddUserModal({
  tab,
  open,
  onClose,
}: {
  tab: UserTab;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("users");
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t(`addModal.title.${tab}`)}
      subtitle={t(`addModal.subtitle.${tab}`)}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" className="flex-1">
            <Plus className="h-4 w-4" />
            {t(`add.${tab}`)}
          </Button>
        </>
      }
    >
      {tab === "students" && <StudentForm />}
      {tab === "drivers" && <DriverForm />}
      {tab === "supervisors" && <SupervisorForm />}
    </Modal>
  );
}
