'use client';

import PropertyForm from "@/components/properties/PropertyForm";

export default function AddPropertyPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>
      <PropertyForm mode={"create"}/>
    </div>
  );
}
