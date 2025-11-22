'use client';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <p>Editing property: {params.id}</p>
    </div>
  );
}
