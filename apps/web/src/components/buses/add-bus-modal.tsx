"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";

export function AddBusModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Add New Bus"
      subtitle="Enter the vehicle's identification, specifications, and capacity to include it in the active fleet."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Add Bus
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField label="Bus Number / ID" required>
          <Input placeholder="e.g., Bus 05" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Bus Model" required>
            <Input placeholder="e.g., Toyota Coaster 2024" />
          </FormField>
          <FormField label="License Plate Number" required>
            <Input placeholder="e.g., 1234 ج ب أ" />
          </FormField>
        </div>
        <FormField label="Total Capacity (Seats)" required>
          <Input placeholder="e.g., 25 Students" />
        </FormField>
        <FormField label="Odometer (Current KM)" required>
          <Input placeholder="e.g., 12,500 km" />
        </FormField>
      </div>
    </Modal>
  );
}
