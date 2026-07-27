"use client";

import { ImagePlus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, type UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { PillTabs } from "@/components/ui/tabs";
import { useState } from "react";

type UserTab = "students" | "drivers" | "supervisors";
type Values = Record<string, string | undefined>;
type Reg = UseFormRegister<Values>;

/** Drops empty/undefined values so optional fields (esp. dates/numbers) aren't sent as "". */
function prune(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""));
}

function buildPayload(tab: UserTab, v: Values): Record<string, unknown> {
  if (tab === "students") {
    return prune({
      full_name: v.full_name,
      date_of_birth: v.date_of_birth,
      grade: v.grade,
      class_name: v.class_name,
      area: v.area,
      address: v.address,
      phone: v.phone,
    });
  }
  if (tab === "drivers") {
    return prune({
      full_name: v.full_name,
      phone: v.phone,
      national_id: v.national_id,
      license_number: v.license_number,
      license_expiry: v.license_expiry,
      experience_years: v.experience_years ? Number(v.experience_years) : undefined,
    });
  }
  return prune({
    full_name: v.full_name,
    phone: v.phone,
    national_id: v.national_id,
    area: v.area,
    address: v.address,
  });
}

const TITLES: Record<UserTab, { title: string; subtitle: string; add: string }> = {
  students: { title: "addModal.title.students", subtitle: "addModal.subtitle.students", add: "add.students" },
  drivers: { title: "addModal.title.drivers", subtitle: "addModal.subtitle.drivers", add: "add.drivers" },
  supervisors: { title: "addModal.title.supervisors", subtitle: "addModal.subtitle.supervisors", add: "add.supervisors" },
};

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

function StudentFields({ register }: { register: Reg }) {
  const t = useTranslations("users.addModal");
  const [pill, setPill] = useState("personal");
  return (
    <div>
      <PillTabs
        items={[
          { key: "personal", label: t("tabs.personal") },
          { key: "address", label: t("tabs.address") },
        ]}
        value={pill}
        onValueChange={setPill}
        className="mb-5"
      />
      {pill === "personal" && (
        <div className="flex flex-col gap-4">
          <PhotoUploader />
          <FormField label={t("fields.fullName")} required>
            <Input placeholder="e.g., Ahmed Ali Hassan" {...register("full_name", { required: true })} />
          </FormField>
          <FormField label={t("fields.dob")}>
            <Input type="date" {...register("date_of_birth")} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label={t("fields.grade")}>
              <Input placeholder="Primary 3" {...register("grade")} />
            </FormField>
            <FormField label={t("fields.class")}>
              <Input placeholder="3A" {...register("class_name")} />
            </FormField>
          </div>
        </div>
      )}
      {pill === "address" && (
        <div className="flex flex-col gap-4">
          <FormField label={t("fields.area")}>
            <Select placeholder="Select Area (e.g., New Cairo)" {...register("area")}>
              <option>New Cairo</option>
              <option>Shorouk</option>
              <option>Madinaty</option>
            </Select>
          </FormField>
          <FormField label={t("fields.fullAddress")}>
            <Textarea placeholder="Building number, Street name, District, Landmarks" {...register("address")} />
          </FormField>
        </div>
      )}
    </div>
  );
}

function DriverFields({ register }: { register: Reg }) {
  const t = useTranslations("users.addModal");
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.personal")}</h3>
        <PhotoUploader />
        <FormField label={t("fields.fullName")} required>
          <Input placeholder="e.g., Samy Ahmed Ali" {...register("full_name", { required: true })} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("fields.phone")}>
            <Input placeholder="e.g., 01123456789" {...register("phone")} />
          </FormField>
          <FormField label={t("fields.nationalId")}>
            <Input placeholder="e.g., 301xxxxxxxxxx" {...register("national_id")} />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.work")}</h3>
        <FormField label={t("fields.license")}>
          <Input placeholder="e.g., 123456789" {...register("license_number")} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("fields.licenseExpiry")}>
            <Input type="date" {...register("license_expiry")} />
          </FormField>
          <FormField label={t("fields.experience")}>
            <Input type="number" placeholder="e.g., 5" {...register("experience_years")} />
          </FormField>
        </div>
      </section>
    </div>
  );
}

function SupervisorFields({ register }: { register: Reg }) {
  const t = useTranslations("users.addModal");
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.personal")}</h3>
        <PhotoUploader />
        <FormField label={t("fields.fullName")} required>
          <Input placeholder="e.g., Mona Mahmoud Ali" {...register("full_name", { required: true })} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={t("fields.phone")}>
            <Input placeholder="e.g., 01123456789" {...register("phone")} />
          </FormField>
          <FormField label={t("fields.nationalId")}>
            <Input placeholder="e.g., 301xxxxxxxxxx" {...register("national_id")} />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">{t("sections.home")}</h3>
        <FormField label={t("fields.area")}>
          <Select placeholder="Select Area (e.g., New Cairo)" {...register("area")}>
            <option>New Cairo</option>
            <option>Shorouk</option>
            <option>Madinaty</option>
          </Select>
        </FormField>
        <FormField label={t("fields.fullAddress")}>
          <Textarea placeholder="Building number, Street name, District, Landmarks" {...register("address")} />
        </FormField>
      </section>
    </div>
  );
}

export function AddUserModal({
  tab,
  open,
  onClose,
  onSubmit,
  submitting,
}: {
  tab: UserTab;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  submitting?: boolean;
}) {
  const t = useTranslations("users");
  const meta = TITLES[tab];
  const { register, handleSubmit, reset } = useForm<Values>();

  const submit = handleSubmit(async (v) => {
    await onSubmit(buildPayload(tab, v));
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t(meta.title)}
      subtitle={t(meta.subtitle)}
      footer={
        <>
          <Button variant="outline" type="button" className="flex-1" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="submit" form="add-user-form" className="flex-1" disabled={submitting}>
            <Plus className="h-4 w-4" />
            {t(meta.add)}
          </Button>
        </>
      }
    >
      <form id="add-user-form" onSubmit={submit}>
        {tab === "students" && <StudentFields register={register} />}
        {tab === "drivers" && <DriverFields register={register} />}
        {tab === "supervisors" && <SupervisorFields register={register} />}
      </form>
    </Modal>
  );
}
