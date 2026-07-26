"use client";

import { ImagePlus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { PillTabs } from "@/components/ui/tabs";
import type { UserTab } from "@/lib/mock/users";

const TITLES: Record<UserTab, { title: string; subtitle: string; add: string }> = {
  students: {
    title: "Add New Student",
    subtitle:
      "Enter the student's details, guardian contact, and address to register them in the system.",
    add: "Add Student",
  },
  drivers: {
    title: "Add New Driver",
    subtitle:
      "Enter the driver's personal details, license information, and experience to register them in the fleet.",
    add: "Add Driver",
  },
  supervisors: {
    title: "Add New Supervisor",
    subtitle:
      "Enter the supervisor's personal details and home address. The system will use the address as the initial route stop.",
    add: "Add Supervisor",
  },
};

function PhotoUploader() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">
        <ImagePlus className="h-6 w-6" />
        <span className="absolute -end-0.5 -bottom-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-navy text-white">
          <Plus className="h-3 w-3" />
        </span>
      </div>
      <div className="text-sm">
        <div className="font-medium text-slate-700">Upload photo</div>
        <div className="text-xs text-slate-400">PNG, JPG, up to 5MB</div>
      </div>
    </div>
  );
}

function StudentForm() {
  const [tab, setTab] = useState("personal");
  return (
    <div>
      <PillTabs
        items={[
          { key: "personal", label: "Personal Info" },
          { key: "contact", label: "Contact" },
          { key: "address", label: "Address" },
        ]}
        value={tab}
        onValueChange={setTab}
        className="mb-5"
      />
      {tab === "personal" && (
        <div className="flex flex-col gap-4">
          <PhotoUploader />
          <FormField label="Full Name" required>
            <Input placeholder="e.g., Ahmed Ali Hassan" />
          </FormField>
          <FormField label="Date of Birth" required>
            <Input type="date" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Grade" required>
              <Select placeholder="Select Grade">
                <option>Primary 1</option>
                <option>Primary 2</option>
                <option>Primary 3</option>
              </Select>
            </FormField>
            <FormField label="Class" required>
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
          <FormField label="Primary Guardian Name" required>
            <Input placeholder="e.g., Sara Mohamed Hussien" />
          </FormField>
          <FormField label="Phone Number" required>
            <Input placeholder="e.g., 01123456789" />
          </FormField>
          <FormField label="Relationship" required>
            <Select placeholder="Select (Mother / Father / Other)">
              <option>Mother</option>
              <option>Father</option>
              <option>Other</option>
            </Select>
          </FormField>
          <FormField label="Email (Optional)">
            <Input type="email" placeholder="e.g., guardian@email.com" />
          </FormField>
        </div>
      )}
      {tab === "address" && (
        <div className="flex flex-col gap-4">
          <FormField label="Area" required>
            <Select placeholder="Select Area (e.g., New Cairo)">
              <option>New Cairo</option>
              <option>Shorouk</option>
              <option>Madinaty</option>
            </Select>
          </FormField>
          <FormField label="Full Address" required>
            <Textarea placeholder="Building number, Street name, District, Landmarks" />
          </FormField>
        </div>
      )}
    </div>
  );
}

function DriverForm() {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">Personal Info</h3>
        <PhotoUploader />
        <FormField label="Full Name" required>
          <Input placeholder="e.g., Samy Ahmed Ali" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone Number" required>
            <Input placeholder="e.g., 01123456789" />
          </FormField>
          <FormField label="National ID" required>
            <Input placeholder="e.g., 301xxxxxxxxxx" />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">Work Info</h3>
        <FormField label="Driver's License Number" required>
          <Input placeholder="e.g., 123456789" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="License Expiry Date" required>
            <Input type="date" />
          </FormField>
          <FormField label="Years of Experience" required>
            <Input placeholder="e.g., 5 years" />
          </FormField>
        </div>
      </section>
    </div>
  );
}

function SupervisorForm() {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">Personal Info</h3>
        <PhotoUploader />
        <FormField label="Full Name" required>
          <Input placeholder="e.g., Mona Mahmoud Ali" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone Number" required>
            <Input placeholder="e.g., 01123456789" />
          </FormField>
          <FormField label="National ID" required>
            <Input placeholder="e.g., 301xxxxxxxxxx" />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-brand-navy">Home Address</h3>
        <FormField label="Area" required>
          <Select placeholder="Select Area (e.g., New Cairo)">
            <option>New Cairo</option>
            <option>Shorouk</option>
            <option>Madinaty</option>
          </Select>
        </FormField>
        <FormField label="Full Address" required>
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
  const meta = TITLES[tab];
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={meta.title}
      subtitle={meta.subtitle}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            {meta.add}
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
